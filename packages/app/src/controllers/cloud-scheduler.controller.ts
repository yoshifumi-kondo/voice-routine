import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { CallFlow } from "src/flow/call.flow";
import { CloudSchedulerAuthGuard } from "src/infrastructure/nest/guard/cloud-scheduler-auth.guard";

@ApiTags("cloud-scheduler")
@Controller("cloud-scheduler")
@UseGuards(CloudSchedulerAuthGuard)
@ApiHeader({
  name: "x-scheduler-token",
  description: "Cloud Scheduler token",
  required: true,
})
export class CloudSchedulerController {
  constructor(private readonly callFlow: CallFlow) {}

    @Post("initiate-calls")
  @HttpCode(HttpStatus.OK)
  async initiateScheduledCalls(): Promise<{ message: string }> {
    try {
      await this.callFlow.initialCallToScheduledUsers();
      console.log("Scheduled call initiation completed.");
      return { message: "Scheduled call initiation completed." };
    } catch (error) {
      console.error("Error initiating scheduled calls:", error);
      return { message: "Error initiating scheduled calls" };
    }
  }
}
