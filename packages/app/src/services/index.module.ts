import { Module } from "@nestjs/common";
import { CallFlow } from "src/flow/call.flow";
import { PrismaRepositoriesModule } from "src/infrastructure/prisma/prisma.repository.module";
import { CallsService } from "src/services/call.service";
import { ConversationService } from "src/services/conversation.service";
import { SpeechService } from "src/services/speech.service";
import { TaskCallService } from "src/services/task-call.service";
import { TasksService } from "src/services/task.service";
import { TwilioService } from "src/services/twilio.service";
import { UserCallScheduleService } from "src/services/user-call-schedule.service";
import { UsersService } from "src/services/user.service";

@Module({
  imports: [PrismaRepositoriesModule],
  providers: [
    TwilioService,
    SpeechService,
    TasksService,
    ConversationService,
    TaskCallService,
    CallsService,
    UsersService,
    UserCallScheduleService,
    CallFlow,
  ],
  exports: [
    TwilioService,
    SpeechService,
    TaskCallService,
    TasksService,
    ConversationService,
    CallsService,
    UsersService,
    UserCallScheduleService,
    CallFlow,
  ],
})
export class ServiceModule {}
