import { Injectable } from "@nestjs/common";
import {
  TaskCallDomain,
  TaskId,
  CallId,
  TaskCallRepository,
  createTaskCall,
  UserId,
} from "../domain";
import { TaskCallEvent } from "@prisma/client";

@Injectable()
export class TaskCallService {
  constructor(private readonly taskCallRepository: TaskCallRepository) {}

    async findByCallId(callId: CallId): Promise<TaskCallDomain | null> {
    const results = await this.taskCallRepository.findByCallId(callId);
    return results.length > 0 ? new TaskCallDomain(results[0]) : null;
  }

    async findByTaskId(taskId: TaskId): Promise<TaskCallDomain[]> {
    const results = await this.taskCallRepository.findByTaskId(taskId);
    return results.map((props) => new TaskCallDomain(props));
  }

  async isCalledToday(userId: UserId, type: TaskCallEvent): Promise<boolean> {
    const results = await this.taskCallRepository.findTodayCalls(userId, type);
    return results.length > 0;
  }

    async save(taskCall: TaskCallDomain): Promise<void> {
    await this.taskCallRepository.save(taskCall.toObject());
  }

  async createMultipleTasks(
    callId: CallId,
    taskIds: TaskId[],
    eventType: TaskCallEvent
  ): Promise<void> {
    const taskCalls = taskIds.map((taskId) =>
      createTaskCall({ callId, taskId, eventType })
    );
    await this.taskCallRepository.bulkSave(
      taskCalls.map((tc) => tc.toObject())
    );
  }
}
