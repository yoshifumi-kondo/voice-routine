import { Module } from "@nestjs/common";
import { CallFlow } from "src/flow/call.flow";
import { ServiceModule } from "src/services/index.module";
import { TaskManageFlow } from "src/flow/task-manage.flow";
import { CallScheduleFlow } from "src/flow/call-schedule.flow";
import { UserFlow } from "src/flow/user.flow";

@Module({
  imports: [ServiceModule],
  providers: [CallFlow, TaskManageFlow, CallFlow, CallScheduleFlow, UserFlow],
  exports: [CallFlow, TaskManageFlow, CallFlow, CallScheduleFlow, UserFlow],
})
export class FlowModule {}
