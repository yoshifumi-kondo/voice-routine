
import { Controller, Put, UseGuards, Body, Get } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ZodValidationPipe, zodToOpenAPI } from "nestjs-zod";
import { z } from "zod";
import { FirebaseAuthGuard } from "src/infrastructure/nest/guard/auth.guard";
import { CurrentUser } from "src/infrastructure/nest/decorator/current-user.decorator";
import { CallScheduleFlow } from "src/flow/call-schedule.flow";
import {
  UserCallSchedule,
  UserCallScheduleDomain,
  UserCallScheduleSchema,
} from "src/domain";

const HHmmRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const UpdateCallScheduleSchema = z.object({
  taskCreationCallTimeUTC: z.string().refine((val) => HHmmRegex.test(val), {
    message: "Invalid time format for taskCreationCallTimeUTC. Expected HH:mm",
  }),
  taskConfirmCallTimeUTC: z.string().refine((val) => HHmmRegex.test(val), {
    message: "Invalid time format for taskConfirmCallTimeUTC. Expected HH:mm",
  }),
  callTimeZone: z.string(),
});
type UpdateCallScheduleDto = z.infer<typeof UpdateCallScheduleSchema>;

@ApiTags("call-schedule")
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller("call-schedule")
export class CallScheduleController {
  constructor(private readonly callScheduleFlow: CallScheduleFlow) {}

  @Get()
  @ApiOperation({ summary: "Get call schedule for the authenticated user" })
  @ApiResponse({
    status: 200,
    description: "Call schedule retrieved successfully",
    schema: zodToOpenAPI(UserCallScheduleSchema),
  })
  async getCallSchedule(
    @CurrentUser() user: CurrentUser
  ): Promise<UserCallSchedule> {
    const schedule = await this.callScheduleFlow.getCallSchedule(user.uid);
    if (!schedule) {
      const defaultSchedule = new UserCallScheduleDomain({
        userId: user.uid,
        taskCreationCallTimeUTC: "09:00",
        taskConfirmCallTimeUTC: "18:00",
        callTimeZone: "Asia/Tokyo",
      });
      return defaultSchedule.toObject();
    }
    return schedule.toObject();
  }

  @Put()
  @ApiOperation({ summary: "Update call schedule for the authenticated user" })
  @ApiBody({ schema: zodToOpenAPI(UpdateCallScheduleSchema) })
  @ApiResponse({
    status: 200,
    description: "Call schedule updated",
    type: Object,
  })
  async updateCallSchedule(
    @CurrentUser() user: CurrentUser,
    @Body(new ZodValidationPipe(UpdateCallScheduleSchema))
    dto: UpdateCallScheduleDto
  ): Promise<UserCallScheduleDomain> {
    
    const updatedSchedule = await this.callScheduleFlow.updateCallSchedule(
      user.uid,
      dto.taskCreationCallTimeUTC,
      dto.taskConfirmCallTimeUTC,
      dto.callTimeZone
    );
    return updatedSchedule;
  }
}
