
import { Injectable } from "@nestjs/common";
import { UserCallScheduleService } from "src/services/user-call-schedule.service";
import { UserCallScheduleDomain, UserId } from "src/domain";

@Injectable()
export class CallScheduleFlow {
  constructor(private readonly scheduleService: UserCallScheduleService) {}

  async getCallSchedule(
    userId: UserId
  ): Promise<UserCallScheduleDomain | null> {
    return await this.scheduleService.getSchedule(userId);
  }

    async updateCallSchedule(
    userId: UserId,
    taskCreationCallTimeUTC: string,
    taskConfirmCallTimeUTC: string,
    callTimeZone: string
  ): Promise<UserCallScheduleDomain> {
    
    return await this.scheduleService.updateSchedule({
      userId,
      taskCreationCallTimeUTC,
      taskConfirmCallTimeUTC,
      callTimeZone,
    });
  }
}
