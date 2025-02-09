import { Injectable } from "@nestjs/common";
import { ConversationService } from "../services/conversation.service";
import { SpeechService } from "../services/speech.service";
import { TasksService } from "../services/task.service";
import { UserId, CallId, CallStatus, createCall } from "../domain";
import { TwilioService } from "src/services/twilio.service";
import { twiml } from "twilio";
import { TaskCallEvent } from "@prisma/client";
import { CallsService } from "src/services/call.service";
import { TaskCallService } from "src/services/task-call.service";
import { UsersService } from "src/services/user.service";
import { UserCallScheduleService } from "src/services/user-call-schedule.service";

@Injectable()
export class CallFlow {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly userService: UsersService,
    private readonly speechService: SpeechService,
    private readonly tasksService: TasksService,
    private readonly callsService: CallsService,
    private readonly taskCallService: TaskCallService,
    private readonly twilioService: TwilioService,
    private readonly userCallScheduleService: UserCallScheduleService
  ) {}

  async handleStatusCallback(callSid: CallId, callStatus: CallStatus) {
    
    this.twilioService.handleStatusCallback({
      CallSid: callSid,
      CallStatus: callStatus,
    });
    
    await this.callsService.updateCallState(callSid, callStatus);
  }

  async initiateCall(
    to: string,
    userId: UserId,
    type: TaskCallEvent
  ): Promise<string> {
    const callSid: string = await this.twilioService.makeCall(to, type, userId);
    const newCall = createCall({
      id: CallId.parse(callSid),
      status: "INITIATED",
      userId,
      startTime: new Date(),
    });
    await this.callsService.save(newCall);
    return callSid;
  }

  async initiateCallToUser(
    userId: UserId,
    type: TaskCallEvent
  ): Promise<string> {
    const phoneNumber = await this.userService.getUserPhoneNumber(userId);
    const callSid: string = await this.twilioService.makeCall(
      phoneNumber,
      type,
      userId
    );
    const newCall = createCall({
      id: CallId.parse(callSid),
      status: "INITIATED",
      userId,
      startTime: new Date(),
    });
    await this.callsService.save(newCall);
    return callSid;
  }

  async generateCallResponse(
    userId: UserId,
    callSid: CallId,
    eventType: TaskCallEvent,
    userInput?: string
  ): Promise<string> {
    const response = new twiml.VoiceResponse();
    
    const convResult = await this.conversationService.createTodo(
      callSid,
      userInput
    );
    const { phase, message, tasks } = convResult;
    
    const audioUrl = await this.speechService.generateAudioFromText(message);
    response.play(audioUrl);
    if (phase === "DONE") {
      
      const created = await this.tasksService.createMultipleTasks(
        userId,
        tasks
      );
      await this.taskCallService.createMultipleTasks(
        callSid,
        created.map((m) => m.id),
        eventType
      );
      response.hangup();
      return response.toString();
    }
    
    response.gather({
      input: ["speech"],
      language: "ja-JP",
      speechTimeout: "auto",
      action: `/calls/webhook?type=${eventType}&callSid=${callSid}&userId=${userId}`,
      method: "POST",
    });
    return response.toString();
  }

  async generateTodayResponse(
    userId: UserId,
    callSid: CallId,
    userInput: string
  ): Promise<string> {
    const response = new twiml.VoiceResponse();
    const todaysTasks = await this.tasksService.findTodaysRemainingTasks(
      userId
    );
    const convResult = await this.conversationService.updateTodo(
      callSid,
      todaysTasks,
      userInput
    );
    const { phase, message, tasks } = convResult;
    const audioUrl = await this.speechService.generateAudioFromText(message);
    response.play(audioUrl);
    if (phase === "DONE") {
      await this.tasksService.updateTasks(tasks);
      response.hangup();
      return response.toString();
    }
    response.gather({
      input: ["speech"],
      language: "ja-JP",
      speechTimeout: "auto",
      action: `/calls/today?callSid=${callSid}&userId=${userId}`,
      method: "POST",
    });
    return response.toString();
  }

    private getRoundedTime(date: Date): Date {
    
    const rounded = new Date(date);
    rounded.setHours(date.getHours() + 9);
    const minutes = date.getMinutes();
    const roundedMinutes = Math.round(minutes / 15) * 15;
    if (roundedMinutes === 60) {
      rounded.setHours(date.getHours() + 1);
      rounded.setMinutes(0);
    } else {
      rounded.setMinutes(roundedMinutes);
    }
    rounded.setSeconds(0);
    rounded.setMilliseconds(0);
    return rounded;
  }

    async initialCallToScheduledUsers(): Promise<void> {
    const now = new Date();
    const roundedTime = this.getRoundedTime(now);
    const currentTimeStr = roundedTime.toISOString().substr(11, 5);

    
    const scheduledCallTypes: Array<{
      event: "CREATED" | "CONFIRMED";
      scheduleType: "TASK_CREATION" | "TASK_CONFIRM";
    }> = [
      { event: "CREATED", scheduleType: "TASK_CREATION" },
      { event: "CONFIRMED", scheduleType: "TASK_CONFIRM" },
    ];

    console.log(`Checking for scheduled calls at ${currentTimeStr}`);
    for (const { event, scheduleType } of scheduledCallTypes) {
      
      const schedules =
        await this.userCallScheduleService.getSchedulesForCallType(
          scheduleType,
          roundedTime
        );

      console.log(`Found ${schedules.length} schedules for event ${event}`);
      for (const schedule of schedules) {
        
        const alreadyCalled = await this.taskCallService.isCalledToday(
          schedule.userId,
          event
        );

        console.log(
          `Checking user ${schedule.userId} for event ${event}: alreadyCalled=${alreadyCalled}`
        );
        if (!alreadyCalled) {
          try {
            await this.initiateCallToUser(schedule.userId, event);
            console.log(
              `Scheduled call initiated: event ${event} for user ${schedule.userId} at ${currentTimeStr}`
            );
          } catch (error) {
            console.error(
              `Error initiating scheduled call: event ${event} for user ${schedule.userId}:`,
              error
            );
          }
        } else {
          console.log(
            `User ${schedule.userId} already called today for event ${event}`
          );
        }
      }
    }
  }
}
