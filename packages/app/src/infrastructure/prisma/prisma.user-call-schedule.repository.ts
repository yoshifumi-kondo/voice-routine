import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import {
  UserCallScheduleRepository,
  UserCallSchedule,
  UserId,
} from "src/domain";


function toUserCallSchedule(record: {
  id: string;
  userId: string;
  taskCreationCallTimeUTC: Date;
  taskConfirmCallTimeUTC: Date;
  callTimeZone: string;
  createdAt: Date;
  updatedAt: Date;
}): UserCallSchedule {
  return {
    ...record,
    
    userId: record.userId as unknown as UserId,
    
    taskCreationCallTimeUTC: record.taskCreationCallTimeUTC
      .toISOString()
      .substr(11, 5),
    taskConfirmCallTimeUTC: record.taskConfirmCallTimeUTC
      .toISOString()
      .substr(11, 5),
  } as UserCallSchedule;
}


function parseTimeString(timeStr: string): Date {
  
  return new Date(`1970-01-01T${timeStr}:00.000Z`);
}

@Injectable()
export class PrismaUserCallScheduleRepository
  implements UserCallScheduleRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: UserId): Promise<UserCallSchedule | null> {
    const record = await this.prisma.userCallSchedule.findUnique({
      where: { userId: userId as unknown as string },
    });
    if (!record) return null;
    return toUserCallSchedule(record);
  }

  async upsert(schedule: UserCallSchedule): Promise<void> {
    await this.prisma.userCallSchedule.upsert({
      where: { userId: schedule.userId as unknown as string },
      create: {
        taskCreationCallTimeUTC: parseTimeString(
          schedule.taskCreationCallTimeUTC
        ),
        taskConfirmCallTimeUTC: parseTimeString(
          schedule.taskConfirmCallTimeUTC
        ),
        callTimeZone: schedule.callTimeZone,
        id: schedule.id,
        createdAt: schedule.createdAt,
        userId: schedule.userId as unknown as string,
        updatedAt: schedule.updatedAt,
      },
      update: {
        taskCreationCallTimeUTC: parseTimeString(
          schedule.taskCreationCallTimeUTC
        ),
        taskConfirmCallTimeUTC: parseTimeString(
          schedule.taskConfirmCallTimeUTC
        ),
        callTimeZone: schedule.callTimeZone,
        id: schedule.id,
        createdAt: schedule.createdAt,
        userId: schedule.userId as unknown as string,
        updatedAt: schedule.updatedAt,
      },
    });
  }

  async findByTaskCallTime(
    callType: "TASK_CREATION" | "TASK_CONFIRM",
    time: Date
  ): Promise<UserCallSchedule[]> {
    
    const records = await this.prisma.userCallSchedule.findMany();
    return records
      .filter((rec) => {
        const targetTime: Date =
          callType === "TASK_CREATION"
            ? rec.taskCreationCallTimeUTC
            : rec.taskConfirmCallTimeUTC;
        const formatTime = (d: Date) => d.toISOString().substr(11, 5);
        return formatTime(targetTime) === formatTime(time);
      })
      .map((rec) => toUserCallSchedule(rec));
  }
}
