import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import {
  CallRepository,
  CallId,
  CallProps,
  UserRepository,
  UserId,
  UserProps,
  TaskRepository,
  TaskId,
  TaskProps,
  TaskCallRepository,
  TaskCallProps,
  TaskCallEvent,
} from "src/domain";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: UserId): Promise<UserProps | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return { ...user } as UserProps;
  }

  async save(userProps: UserProps): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: userProps.id },
      create: {
        id: userProps.id,
        createdAt: userProps.createdAt,
      },
      update: {
        createdAt: userProps.createdAt,
      },
    });
  }

  async delete(id: UserId): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}

@Injectable()
export class PrismaCallRepository implements CallRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: CallId): Promise<CallProps | null> {
    const call = await this.prisma.call.findUnique({
      where: { id },
    });
    if (!call) return null;
    return { ...call } as CallProps;
  }

  async save(callProps: CallProps): Promise<void> {
    await this.prisma.call.upsert({
      where: { id: callProps.id },
      create: {
        id: callProps.id,
        startTime: callProps.startTime,
        endTime: callProps.endTime,
        createdAt: callProps.createdAt,
        status: callProps.status,
        userId: callProps.userId,
      },
      update: {
        startTime: callProps.startTime,
        endTime: callProps.endTime,
        status: callProps.status,
        userId: callProps.userId,
      },
    });
  }

  async totalCalls(userId: UserId): Promise<number> {
    return await this.prisma.call.count({
      where: { userId },
    });
  }

  async findByUserId(userId: UserId): Promise<CallProps[]> {
    const calls = await this.prisma.call.findMany({
      where: { userId },
    });
    return calls.map((c) => ({ ...c } as CallProps));
  }

  async findOngoingByUserId(userId: UserId): Promise<CallProps[]> {
    const calls = await this.prisma.call.findMany({
      where: { userId, endTime: null },
    });
    return calls.map((c) => ({ ...c } as CallProps));
  }
}

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: TaskId): Promise<TaskProps | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) return null;
    return { ...task } as TaskProps;
  }

  async save(taskProps: TaskProps): Promise<void> {
    await this.prisma.task.upsert({
      where: { id: taskProps.id },
      create: {
        id: taskProps.id,
        description: taskProps.description,
        createdAt: taskProps.createdAt,
        completed: taskProps.completed,
        userId: taskProps.userId,
      },
      update: {
        description: taskProps.description,
        completed: taskProps.completed,
        userId: taskProps.userId,
      },
    });
  }

  async bulkSave(tasks: TaskProps[]): Promise<void> {
    await this.prisma.task.createMany({
      data: tasks.map((t) => ({
        id: t.id,
        description: t.description,
        createdAt: t.createdAt,
        completed: t.completed,
        userId: t.userId,
      })),
      skipDuplicates: true,
    });
  }

  async findByUserId(userId: UserId): Promise<TaskProps[]> {
    const tasks = await this.prisma.task.findMany({
      where: { userId },
    });
    return tasks.map((t) => ({ ...t } as TaskProps));
  }

  async delete(id: TaskId): Promise<void> {
    await this.prisma.task.delete({
      where: { id },
    });
  }
}

@Injectable()
export class PrismaTaskCallRepository implements TaskCallRepository {
  constructor(private prisma: PrismaService) {}

  async findByCallId(callId: CallId): Promise<TaskCallProps[]> {
    const taskCall = await this.prisma.taskCall.findMany({
      where: { callId },
    });
    return taskCall ? [taskCall as TaskCallProps] : [];
  }

  async findByTaskId(taskId: TaskId): Promise<TaskCallProps[]> {
    const taskCalls = await this.prisma.taskCall.findMany({
      where: { taskId },
    });
    return taskCalls.map((tc) => ({ ...tc } as TaskCallProps));
  }

  async findTodayCalls(
    userId: UserId,
    type: TaskCallEvent
  ): Promise<TaskCallProps[]> {
    const taskCalls = await this.prisma.taskCall.findMany({
      where: {
        eventType: type,
        task: {
          user: {
            id: userId,
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        },
      },
    });

    return taskCalls.map((tc) => ({ ...tc } as TaskCallProps));
  }

  async save(tc: TaskCallProps): Promise<void> {
    await this.prisma.taskCall.create({
      data: {
        callId: tc.callId,
        taskId: tc.taskId,
        eventType: tc.eventType,
      },
    });
  }

  async bulkSave(tcs: TaskCallProps[]): Promise<void> {
    await this.prisma.taskCall.createMany({
      data: tcs.map((tc) => ({
        callId: tc.callId,
        taskId: tc.taskId,
        eventType: tc.eventType,
      })),
      skipDuplicates: true,
    });
  }
}
