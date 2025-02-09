
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AudioController } from "src/controllers/audio.controller";
import { CallController } from "src/controllers/call.controller";
import { FlowModule } from "src/flow/index.module";
import { TaskController } from "src/controllers/task.controller";
import { CallScheduleController } from "src/controllers/call-schedule.controller";
import { UserController } from "src/controllers/user.controller";
import { CloudSchedulerController } from "src/controllers/cloud-scheduler.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FlowModule,
  ],
  controllers: [
    CallController,
    AudioController,
    TaskController,
    CloudSchedulerController,
    CallScheduleController,
    UserController,
  ],
  providers: [],
})
export class AppModule {}
