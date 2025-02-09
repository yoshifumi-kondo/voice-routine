import { Injectable } from "@nestjs/common";
import {
  createUserCallSchedule,
  UserCallScheduleDomain,
  UserCallScheduleRepository,
  UserId,
} from "src/domain";

@Injectable()
export class UserCallScheduleService {
  constructor(private readonly repo: UserCallScheduleRepository) {}

  async getSchedule(userId: UserId): Promise<UserCallScheduleDomain | null> {
    const schedule = await this.repo.findByUserId(userId);
    if (!schedule) return null;
    return new UserCallScheduleDomain(schedule);
  }

  async updateSchedule(params: {
    userId: UserId;
    taskCreationCallTimeUTC: string; 
    taskConfirmCallTimeUTC: string; 
    callTimeZone: string;
  }): Promise<UserCallScheduleDomain> {
    const scheduleDomain = createUserCallSchedule(params);
    await this.repo.upsert(scheduleDomain.toObject());
    return scheduleDomain;
  }

  async getSchedulesForCallType(
    callType: "TASK_CREATION" | "TASK_CONFIRM",
    time: Date
  ): Promise<UserCallScheduleDomain[]> {
    const schedules = await this.repo.findByTaskCallTime(callType, time);
    return schedules.map((s) => new UserCallScheduleDomain(s));
  }
}
