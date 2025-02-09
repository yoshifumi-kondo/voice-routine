import { Module } from "@nestjs/common";
import {
  PrismaUserRepository,
  PrismaCallRepository,
  PrismaTaskRepository,
  PrismaTaskCallRepository,
} from "./prisma.repository";
import {
  CallRepository,
  TaskCallRepository,
  TaskRepository,
  UserCallScheduleRepository,
  UserRepository,
} from "src/domain";

import { PrismaService } from "./prisma.service";
import { PrismaUserCallScheduleRepository } from "src/infrastructure/prisma/prisma.user-call-schedule.repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: CallRepository,
      useClass: PrismaCallRepository,
    },
    {
      provide: TaskRepository,
      useClass: PrismaTaskRepository,
    },
    {
      provide: TaskCallRepository,
      useClass: PrismaTaskCallRepository,
    },
    {
      provide: UserCallScheduleRepository,
      useClass: PrismaUserCallScheduleRepository,
    },
  ],
  exports: [
    PrismaService,
    UserRepository,
    CallRepository,
    TaskRepository,
    TaskCallRepository,
    UserCallScheduleRepository,
  ],
})
export class PrismaRepositoriesModule {}
