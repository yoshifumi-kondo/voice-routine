
import { z } from "zod";

export const UserId = z.string().brand<"UserId">();
export type UserId = z.infer<typeof UserId>;

export const CallId = z.string().brand<"CallId">();
export type CallId = z.infer<typeof CallId>;

export const TaskId = z.string().brand<"TaskId">();
export type TaskId = z.infer<typeof TaskId>;

export const CallStatus_Enum = z.enum([
  "INITIATED",
  "ANSWERED",
  "NO_ANSWER",
  "BUSY",
  "FAILED",
]);
export type CallStatus = z.infer<typeof CallStatus_Enum>;

export const TaskCallEvent_Enum = z.enum(["CREATED", "CONFIRMED"]);
export type TaskCallEvent = z.infer<typeof TaskCallEvent_Enum>;

export const UserPropsSchema = z.object({
  id: UserId,
  createdAt: z.date(),
});
export type UserProps = z.infer<typeof UserPropsSchema>;

export class UserDomain {
  constructor(private props: UserProps) {}
  get id() {
    return this.props.id;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  isNewUser(): boolean {
    return Date.now() - this.props.createdAt.getTime() < 86400000; 
  }
  toObject(): UserProps {
    return { ...this.props };
  }
}
export function createUser(): UserDomain {
  const props = UserPropsSchema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
  });
  return new UserDomain(props);
}
export function validateUser(u: unknown): UserDomain {
  const parsed = UserPropsSchema.parse(u);
  return new UserDomain(parsed);
}

export const CallPropsSchema = z.object({
  id: CallId,
  startTime: z.date(),
  endTime: z.date().nullable(),
  createdAt: z.date(),
  status: CallStatus_Enum,
  userId: UserId,
});
export type CallProps = z.infer<typeof CallPropsSchema>;

export class CallDomain {
  constructor(private props: CallProps) {}
  get id() {
    return this.props.id;
  }
  get startTime() {
    return this.props.startTime;
  }
  get endTime() {
    return this.props.endTime;
  }
  get status() {
    return this.props.status;
  }
  get userId() {
    return this.props.userId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  isOngoing(): boolean {
    return this.props.endTime === null;
  }
  duration(): number | null {
    if (!this.props.endTime) return null;
    return this.props.endTime.getTime() - this.props.startTime.getTime();
  }
  updateStatus(newStatus: CallStatus, endTime: Date): CallDomain {
    if (this.props.endTime) {
      throw new Error("Call is already ended.");
    }
    if (endTime <= this.props.startTime) {
      throw new Error("End time must be after start time.");
    }
    const updatedProps = {
      ...this.props,
      endTime,
      status: newStatus,
    };
    const validated = CallPropsSchema.parse(updatedProps);
    return new CallDomain(validated);
  }
  toObject(): CallProps {
    return { ...this.props };
  }
}
export function createCall(params: {
  id: CallId;
  status: CallStatus;
  userId: UserId;
  startTime?: Date;
}): CallDomain {
  const props = CallPropsSchema.parse({
    id: params.id,
    startTime: params.startTime ?? new Date(),
    endTime: null,
    createdAt: new Date(),
    status: params.status,
    userId: params.userId,
  });
  return new CallDomain(props);
}
export function validateCall(c: unknown): CallDomain {
  const parsed = CallPropsSchema.parse(c);
  return new CallDomain(parsed);
}

export const TaskPropsSchema = z.object({
  id: TaskId,
  description: z.string().min(1),
  createdAt: z.date(),
  completed: z.boolean(),
  userId: UserId,
});
export type TaskProps = z.infer<typeof TaskPropsSchema>;

export class TaskDomain {
  constructor(private props: TaskProps) {}
  get id() {
    return this.props.id;
  }
  get description() {
    return this.props.description;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get completed() {
    return this.props.completed;
  }
  get userId() {
    return this.props.userId;
  }
  complete(): TaskDomain {
    if (this.props.completed) {
      throw new Error("Task is already completed.");
    }
    const updated = { ...this.props, completed: true };
    const validated = TaskPropsSchema.parse(updated);
    return new TaskDomain(validated);
  }
  isOverdue(deadline: Date): boolean {
    if (this.props.completed) return false;
    return new Date() > deadline;
  }
  toObject(): TaskProps {
    return { ...this.props };
  }
}
export function createTask(params: {
  description: string;
  userId: UserId;
}): TaskDomain {
  const props = TaskPropsSchema.parse({
    id: crypto.randomUUID(),
    description: params.description,
    createdAt: new Date(),
    completed: false,
    userId: params.userId,
  });
  return new TaskDomain(props);
}
export function validateTask(t: unknown): TaskDomain {
  const parsed = TaskPropsSchema.parse(t);
  return new TaskDomain(parsed);
}

export const TaskCallPropsSchema = z.object({
  callId: CallId,
  taskId: TaskId,
  eventType: TaskCallEvent_Enum,
});
export type TaskCallProps = z.infer<typeof TaskCallPropsSchema>;

export class TaskCallDomain {
  constructor(private props: TaskCallProps) {}
  get callId() {
    return this.props.callId;
  }
  get taskId() {
    return this.props.taskId;
  }
  get eventType() {
    return this.props.eventType;
  }
  isCreatedEvent(): boolean {
    return this.props.eventType === "CREATED";
  }
  isConfirmedEvent(): boolean {
    return this.props.eventType === "CONFIRMED";
  }
  toObject(): TaskCallProps {
    return { ...this.props };
  }
}
export function createTaskCall(params: {
  callId: CallId;
  taskId: TaskId;
  eventType: TaskCallEvent;
}): TaskCallDomain {
  const props = TaskCallPropsSchema.parse({
    callId: params.callId,
    taskId: params.taskId,
    eventType: params.eventType,
  });
  return new TaskCallDomain(props);
}
export function validateTaskCall(tc: unknown): TaskCallDomain {
  const parsed = TaskCallPropsSchema.parse(tc);
  return new TaskCallDomain(parsed);
}

const HHmmRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const UserCallScheduleSchema = z.object({
  id: z.string().uuid(),
  userId: UserId,
  
  taskCreationCallTimeUTC: z.string().refine((val) => HHmmRegex.test(val), {
    message: "Invalid time format for taskCreationCallTimeUTC. Expected HH:mm",
  }),
  
  taskConfirmCallTimeUTC: z.string().refine((val) => HHmmRegex.test(val), {
    message: "Invalid time format for taskConfirmCallTimeUTC. Expected HH:mm",
  }),
  callTimeZone: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type UserCallSchedule = z.infer<typeof UserCallScheduleSchema>;

export class UserCallScheduleDomain {
  constructor(private props: UserCallSchedule) {}
  get id() {
    return this.props.id;
  }
  get userId() {
    return this.props.userId;
  }
  get taskCreationCallTimeUTC() {
    return this.props.taskCreationCallTimeUTC;
  }
  get taskConfirmCallTimeUTC() {
    return this.props.taskConfirmCallTimeUTC;
  }
  get callTimeZone() {
    return this.props.callTimeZone;
  }
  toObject(): UserCallSchedule {
    return { ...this.props };
  }
}
export function createUserCallSchedule(params: {
  userId: UserId;
  taskCreationCallTimeUTC: string; 
  taskConfirmCallTimeUTC: string; 
  callTimeZone: string;
}): UserCallScheduleDomain {
  const props = UserCallScheduleSchema.parse({
    id: crypto.randomUUID(),
    userId: params.userId,
    taskCreationCallTimeUTC: params.taskCreationCallTimeUTC,
    taskConfirmCallTimeUTC: params.taskConfirmCallTimeUTC,
    callTimeZone: params.callTimeZone,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return new UserCallScheduleDomain(props);
}
export function validateUserCallSchedule(u: unknown): UserCallScheduleDomain {
  const parsed = UserCallScheduleSchema.parse(u);
  return new UserCallScheduleDomain(parsed);
}

export abstract class UserRepository {
  abstract findById(id: UserId): Promise<UserProps | null>;
  abstract save(userProps: UserProps): Promise<void>;
  abstract delete(id: UserId): Promise<void>;
}

export abstract class CallRepository {
  abstract totalCalls(userId: UserId): Promise<number>;
  abstract findById(id: CallId): Promise<CallProps | null>;
  abstract save(callProps: CallProps): Promise<void>;
  abstract findByUserId(userId: UserId): Promise<CallProps[]>;
  abstract findOngoingByUserId(userId: UserId): Promise<CallProps[]>;
}

export abstract class TaskRepository {
  abstract findById(id: TaskId): Promise<TaskProps | null>;
  abstract save(taskProps: TaskProps): Promise<void>;
  abstract findByUserId(userId: UserId): Promise<TaskProps[]>;
  abstract bulkSave(tasks: TaskProps[]): Promise<void>;
  abstract delete(id: TaskId): Promise<void>;
}

export abstract class TaskCallRepository {
  abstract findByCallId(callId: CallId): Promise<TaskCallProps[]>;
  abstract findByTaskId(taskId: TaskId): Promise<TaskCallProps[]>;
  abstract findTodayCalls(
    userId: UserId,
    type: TaskCallEvent
  ): Promise<TaskCallProps[]>;
  abstract save(tc: TaskCallProps): Promise<void>;
  abstract bulkSave(tcs: TaskCallProps[]): Promise<void>;
}

export abstract class UserCallScheduleRepository {
  abstract findByUserId(userId: UserId): Promise<UserCallSchedule | null>;
  abstract upsert(schedule: UserCallSchedule): Promise<void>;
  abstract findByTaskCallTime(
    callType: "TASK_CREATION" | "TASK_CONFIRM",
    time: Date
  ): Promise<UserCallSchedule[]>;
}
