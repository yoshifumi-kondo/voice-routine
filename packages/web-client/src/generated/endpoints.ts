import useSwr from "swr";
import type { Arguments, Key, SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";
import type { SWRMutationConfiguration } from "swr/mutation";
import { faker } from "@faker-js/faker";
import { HttpResponse, delay, http } from "msw";
import { customFetcher } from "../libs/fetcher";
export type CallControllerInitiateCallToUserBodyType =
  (typeof CallControllerInitiateCallToUserBodyType)[keyof typeof CallControllerInitiateCallToUserBodyType];


export const CallControllerInitiateCallToUserBodyType = {
  CREATED: "CREATED",
  CONFIRMED: "CONFIRMED",
} as const;

export type CallControllerInitiateCallToUserBody = {
  type: CallControllerInitiateCallToUserBodyType;
};

export type CallControllerHandleCallWebhookParams = {
  type: string;
  userId: string;
  callSid: string;
};

export type CallControllerHandleTodayParams = {
  callSid: string;
};

export type TaskControllerGetTasks200Item = {
  id: unknown;
    description: string;
  createdAt: unknown;
  completed: boolean;
  userId: unknown;
};

export type TaskControllerCreateTaskBody = {
    description: string;
};

export type TaskControllerUpdateTaskBody = {
  completed?: boolean;
  description?: string;
};

export type CallScheduleControllerGetCallSchedule200 = {
  id: string;
  userId: unknown;
  taskCreationCallTimeUTC: string;
  taskConfirmCallTimeUTC: string;
  callTimeZone: string;
  createdAt: unknown;
  updatedAt: unknown;
};

export type CallScheduleControllerUpdateCallScheduleBody = {
  taskCreationCallTimeUTC: string;
  taskConfirmCallTimeUTC: string;
  callTimeZone: string;
};

export type CallScheduleControllerUpdateCallSchedule200 = {
  [key: string]: unknown;
};

export type UserControllerSignUpBody = {
    token: string;
};

export type UserControllerGetUser200 = {
  id: unknown;
  createdAt: unknown;
};

export const callControllerInitiateCall = () => {
  return customFetcher<void>({ url: `/calls/initiate`, method: "POST" });
};

export const getCallControllerInitiateCallMutationFetcher = () => {
  return (_: Key, __: { arg: Arguments }): Promise<void> => {
    return callControllerInitiateCall();
  };
};
export const getCallControllerInitiateCallMutationKey = () =>
  [`/calls/initiate`] as const;

export type CallControllerInitiateCallMutationResult = NonNullable<
  Awaited<ReturnType<typeof callControllerInitiateCall>>
>;
export type CallControllerInitiateCallMutationError = unknown;

export const useCallControllerInitiateCall = <TError = unknown>(options?: {
  swr?: SWRMutationConfiguration<
    Awaited<ReturnType<typeof callControllerInitiateCall>>,
    TError,
    Key,
    Arguments,
    Awaited<ReturnType<typeof callControllerInitiateCall>>
  > & { swrKey?: string };
}) => {
  const { swr: swrOptions } = options ?? {};

  const swrKey =
    swrOptions?.swrKey ?? getCallControllerInitiateCallMutationKey();
  const swrFn = getCallControllerInitiateCallMutationFetcher();

  const query = useSWRMutation(swrKey, swrFn, swrOptions);

  return {
    swrKey,
    ...query,
  };
};

export const callControllerInitiateCallToUser = (
  callControllerInitiateCallToUserBody: CallControllerInitiateCallToUserBody
) => {
  return customFetcher<void>({
    url: `/calls/initiate-to-user`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: callControllerInitiateCallToUserBody,
  });
};

export const getCallControllerInitiateCallToUserMutationFetcher = () => {
  return (
    _: Key,
    { arg }: { arg: CallControllerInitiateCallToUserBody }
  ): Promise<void> => {
    return callControllerInitiateCallToUser(arg);
  };
};
export const getCallControllerInitiateCallToUserMutationKey = () =>
  [`/calls/initiate-to-user`] as const;

export type CallControllerInitiateCallToUserMutationResult = NonNullable<
  Awaited<ReturnType<typeof callControllerInitiateCallToUser>>
>;
export type CallControllerInitiateCallToUserMutationError = unknown;

export const useCallControllerInitiateCallToUser = <
  TError = unknown
>(options?: {
  swr?: SWRMutationConfiguration<
    Awaited<ReturnType<typeof callControllerInitiateCallToUser>>,
    TError,
    Key,
    CallControllerInitiateCallToUserBody,
    Awaited<ReturnType<typeof callControllerInitiateCallToUser>>
  > & { swrKey?: string };
}) => {
  const { swr: swrOptions } = options ?? {};

  const swrKey =
    swrOptions?.swrKey ?? getCallControllerInitiateCallToUserMutationKey();
  const swrFn = getCallControllerInitiateCallToUserMutationFetcher();

  const query = useSWRMutation(swrKey, swrFn, swrOptions);

  return {
    swrKey,
    ...query,
  };
};

export const callControllerHandleCallWebhook = (
  params: CallControllerHandleCallWebhookParams
) => {
  return customFetcher<void>({ url: `/calls/webhook`, method: "POST", params });
};

export const getCallControllerHandleCallWebhookMutationFetcher = (
  params: CallControllerHandleCallWebhookParams
) => {
  return (_: Key, __: { arg: Arguments }): Promise<void> => {
    return callControllerHandleCallWebhook(params);
  };
};
export const getCallControllerHandleCallWebhookMutationKey = (
  params: CallControllerHandleCallWebhookParams
) => [`/calls/webhook`, ...(params ? [params] : [])] as const;

export type CallControllerHandleCallWebhookMutationResult = NonNullable<
  Awaited<ReturnType<typeof callControllerHandleCallWebhook>>
>;
export type CallControllerHandleCallWebhookMutationError = unknown;

export const useCallControllerHandleCallWebhook = <TError = unknown>(
  params: CallControllerHandleCallWebhookParams,
  options?: {
    swr?: SWRMutationConfiguration<
      Awaited<ReturnType<typeof callControllerHandleCallWebhook>>,
      TError,
      Key,
      Arguments,
      Awaited<ReturnType<typeof callControllerHandleCallWebhook>>
    > & { swrKey?: string };
  }
) => {
  const { swr: swrOptions } = options ?? {};

  const swrKey =
    swrOptions?.swrKey ?? getCallControllerHandleCallWebhookMutationKey(params);
  const swrFn = getCallControllerHandleCallWebhookMutationFetcher(params);

  const query = useSWRMutation(swrKey, swrFn, swrOptions);

  return {
    swrKey,
    ...query,
  };
};

export const callControllerHandleStatusCallback = () => {
  return customFetcher<void>({ url: `/calls/status`, method: "POST" });
};

export const getCallControllerHandleStatusCallbackMutationFetcher = () => {
  return (_: Key, __: { arg: Arguments }): Promise<void> => {
    return callControllerHandleStatusCallback();
  };
};
export const getCallControllerHandleStatusCallbackMutationKey = () =>
  [`/calls/status`] as const;

export type CallControllerHandleStatusCallbackMutationResult = NonNullable<
  Awaited<ReturnType<typeof callControllerHandleStatusCallback>>
>;
export type CallControllerHandleStatusCallbackMutationError = unknown;

export const useCallControllerHandleStatusCallback = <
  TError = unknown
>(options?: {
  swr?: SWRMutationConfiguration<
    Awaited<ReturnType<typeof callControllerHandleStatusCallback>>,
    TError,
    Key,
    Arguments,
    Awaited<ReturnType<typeof callControllerHandleStatusCallback>>
  > & { swrKey?: string };
}) => {
  const { swr: swrOptions } = options ?? {};

  const swrKey =
    swrOptions?.swrKey ?? getCallControllerHandleStatusCallbackMutationKey();
  const swrFn = getCallControllerHandleStatusCallbackMutationFetcher();

  const query = useSWRMutation(swrKey, swrFn, swrOptions);

  return {
    swrKey,
    ...query,
  };
};

export const callControllerHandleToday = (
  params: CallControllerHandleTodayParams
) => {
  return customFetcher<void>({ url: `/calls/today`, method: "POST", params });
};

export const getCallControllerHandleTodayMutationFetcher = (
  params: CallControllerHandleTodayParams
) => {
  return (_: Key, __: { arg: Arguments }): Promise<void> => {
    return callControllerHandleToday(params);
  };
};
export const getCallControllerHandleTodayMutationKey = (
  params: CallControllerHandleTodayParams
) => [`/calls/today`, ...(params ? [params] : [])] as const;

export type CallControllerHandleTodayMutationResult = NonNullable<
  Awaited<ReturnType<typeof callControllerHandleToday>>
>;
export type CallControllerHandleTodayMutationError = unknown;

export const useCallControllerHandleToday = <TError = unknown>(
  params: CallControllerHandleTodayParams,
  options?: {
    swr?: SWRMutationConfiguration<
      Awaited<ReturnType<typeof callControllerHandleToday>>,
      TError,
      Key,
      Arguments,
      Awaited<ReturnType<typeof callControllerHandleToday>>
    > & { swrKey?: string };
  }
) => {
  const { swr: swrOptions } = options ?? {};

  const swrKey =
    swrOptions?.swrKey ?? getCallControllerHandleTodayMutationKey(params);
  const swrFn = getCallControllerHandleTodayMutationFetcher(params);

  const query = useSWRMutation(swrKey, swrFn, swrOptions);

  return {
    swrKey,
    ...query,
  };
};

export const audioControllerGetAudio = (fileId: string) => {
  return customFetcher<void>({ url: `/audio/${fileId}`, method: "GET" });
};

export const getAudioControllerGetAudioKey = (fileId: string) =>
  [`/audio/${fileId}`] as const;

export type AudioControllerGetAudioQueryResult = NonNullable<
  Awaited<ReturnType<typeof audioControllerGetAudio>>
>;
export type AudioControllerGetAudioQueryError = unknown;

export const useAudioControllerGetAudio = <TError = unknown>(
  fileId: string,
  options?: {
    swr?: SWRConfiguration<
      Awaited<ReturnType<typeof audioControllerGetAudio>>,
      TError
    > & { swrKey?: Key; enabled?: boolean };
  }
) => {
  const { swr: swrOptions } = options ?? {};

  const isEnabled = swrOptions?.enabled !== false && !!fileId;
  const swrKey =
    swrOptions?.swrKey ??
    (() => (isEnabled ? getAudioControllerGetAudioKey(fileId) : null));
  const swrFn = () => audioControllerGetAudio(fileId);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(
    swrKey,
    swrFn,
    swrOptions
  );

  return {
    swrKey,
    ...query,
  };
};

export const taskControllerGetTasks = () => {
  return customFetcher<TaskControllerGetTasks200Item[]>({
    url: `/tasks`,
    method: "GET",
  });
};

export const getTaskControllerGetTasksKey = () => [`/tasks`] as const;

export type TaskControllerGetTasksQueryResult = NonNullable<
  Awaited<ReturnType<typeof taskControllerGetTasks>>
>;
export type TaskControllerGetTasksQueryError = unknown;

export const useTaskControllerGetTasks = <TError = unknown>(options?: {
  swr?: SWRConfiguration<
    Awaited<ReturnType<typeof taskControllerGetTasks>>,
    TError
  > & { swrKey?: Key; enabled?: boolean };
}) => {
  const { swr: swrOptions } = options ?? {};

  const isEnabled = swrOptions?.enabled !== false;
  const swrKey =
    swrOptions?.swrKey ??
    (() => (isEnabled ? getTaskControllerGetTasksKey() : null));
  const swrFn = () => taskControllerGetTasks();

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(
    swrKey,
    swrFn,
    swrOptions
  );

  return {
    swrKey,
    ...query,
  };
};

export const taskControllerCreateTask = (
  taskControllerCreateTaskBody: TaskControllerCreateTaskBody
) => {
  return customFetcher<void>({
    url: `/tasks`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: taskControllerCreateTaskBody,
  });
};

export const getTaskControllerCreateTaskMutationFetcher = () => {
  return (
    _: Key,
    { arg }: { arg: TaskControllerCreateTaskBody }
  ): Promise<void> => {
    return taskControllerCreateTask(arg);
  };
};
export const getTaskControllerCreateTaskMutationKey = () => [`/tasks`] as const;

export type TaskControllerCreateTaskMutationResult = NonNullable<
  Awaited<ReturnType<typeof taskControllerCreateTask>>
>;
export type TaskControllerCreateTaskMutationError = unknown;

export const useTaskControllerCreateTask = <TError = unknown>(options?: {
  swr?: SWRMutationConfiguration<
    Awaited<ReturnType<typeof taskControllerCreateTask>>,
    TError,
    Key,
    TaskControllerCreateTaskBody,
    Awaited<ReturnType<typeof taskControllerCreateTask>>
  > & { swrKey?: string };
}) => {
  const { swr: swrOptions } = options ?? {};

  const swrKey = swrOptions?.swrKey ?? getTaskControllerCreateTaskMutationKey();
  const swrFn = getTaskControllerCreateTaskMutationFetcher();

  const query = useSWRMutation(swrKey, swrFn, swrOptions);

  return {
    swrKey,
    ...query,
  };
};

export const taskControllerUpdateTask = (
  taskId: string,
  taskControllerUpdateTaskBody: TaskControllerUpdateTaskBody
) => {
  return customFetcher<void>({
    url: `/tasks/${taskId}`,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: { ...taskControllerUpdateTaskBody },
  });
};

export const getTaskControllerUpdateTaskMutationFetcher = (taskId: string) => {
  return (
    _: Key,
    { arg }: { arg: TaskControllerUpdateTaskBody }
  ): Promise<void> => {
    return taskControllerUpdateTask(taskId, arg);
  };
};
export const getTaskControllerUpdateTaskMutationKey = (taskId: string) =>
  [`/tasks/${taskId}`] as const;

export type TaskControllerUpdateTaskMutationResult = NonNullable<
  Awaited<ReturnType<typeof taskControllerUpdateTask>>
>;
export type TaskControllerUpdateTaskMutationError = unknown;

export const useTaskControllerUpdateTask = <TError = unknown>(
  taskId: string,
  options?: {
    swr?: SWRMutationConfiguration<
      Awaited<ReturnType<typeof taskControllerUpdateTask>>,
      TError,
      Key,
      TaskControllerUpdateTaskBody,
      Awaited<ReturnType<typeof taskControllerUpdateTask>>
    > & { swrKey?: string };
  }
) => {
  const { swr: swrOptions } = options ?? {};

  const swrKey =
    swrOptions?.swrKey ?? getTaskControllerUpdateTaskMutationKey(taskId);
  const swrFn = getTaskControllerUpdateTaskMutationFetcher(taskId);

  console.log({ swrKey, swrFn, swrOptions });
  const query = useSWRMutation(swrKey, swrFn, swrOptions);

  return {
    swrKey,
    ...query,
  };
};

export const taskControllerDeleteTask = (taskId: string) => {
  return customFetcher<void>({ url: `/tasks/${taskId}`, method: "DELETE" });
};

export const getTaskControllerDeleteTaskMutationFetcher = (taskId: string) => {
  return (_: Key, __: { arg: Arguments }): Promise<void> => {
    return taskControllerDeleteTask(taskId);
  };
};
export const getTaskControllerDeleteTaskMutationKey = (taskId: string) =>
  [`/tasks/${taskId}`] as const;

export type TaskControllerDeleteTaskMutationResult = NonNullable<
  Awaited<ReturnType<typeof taskControllerDeleteTask>>
>;
export type TaskControllerDeleteTaskMutationError = unknown;

export const useTaskControllerDeleteTask = <TError = unknown>(
  taskId: string,
  options?: {
    swr?: SWRMutationConfiguration<
      Awaited<ReturnType<typeof taskControllerDeleteTask>>,
      TError,
      Key,
      Arguments,
      Awaited<ReturnType<typeof taskControllerDeleteTask>>
    > & { swrKey?: string };
  }
) => {
  const { swr: swrOptions } = options ?? {};

  const swrKey =
    swrOptions?.swrKey ?? getTaskControllerDeleteTaskMutationKey(taskId);
  const swrFn = getTaskControllerDeleteTaskMutationFetcher(taskId);

  const query = useSWRMutation(swrKey, swrFn, swrOptions);

  return {
    swrKey,
    ...query,
  };
};

export const callScheduleControllerGetCallSchedule = () => {
  return customFetcher<CallScheduleControllerGetCallSchedule200>({
    url: `/call-schedule`,
    method: "GET",
  });
};

export const getCallScheduleControllerGetCallScheduleKey = () =>
  [`/call-schedule`] as const;

export type CallScheduleControllerGetCallScheduleQueryResult = NonNullable<
  Awaited<ReturnType<typeof callScheduleControllerGetCallSchedule>>
>;
export type CallScheduleControllerGetCallScheduleQueryError = unknown;

export const useCallScheduleControllerGetCallSchedule = <
  TError = unknown
>(options?: {
  swr?: SWRConfiguration<
    Awaited<ReturnType<typeof callScheduleControllerGetCallSchedule>>,
    TError
  > & { swrKey?: Key; enabled?: boolean };
}) => {
  const { swr: swrOptions } = options ?? {};

  const isEnabled = swrOptions?.enabled !== false;
  const swrKey =
    swrOptions?.swrKey ??
    (() => (isEnabled ? getCallScheduleControllerGetCallScheduleKey() : null));
  const swrFn = () => callScheduleControllerGetCallSchedule();

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(
    swrKey,
    swrFn,
    swrOptions
  );

  return {
    swrKey,
    ...query,
  };
};

export const callScheduleControllerUpdateCallSchedule = (
  callScheduleControllerUpdateCallScheduleBody: CallScheduleControllerUpdateCallScheduleBody
) => {
  return customFetcher<CallScheduleControllerUpdateCallSchedule200>({
    url: `/call-schedule`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: callScheduleControllerUpdateCallScheduleBody,
  });
};

export const getCallScheduleControllerUpdateCallScheduleMutationFetcher =
  () => {
    return (
      _: Key,
      { arg }: { arg: CallScheduleControllerUpdateCallScheduleBody }
    ): Promise<CallScheduleControllerUpdateCallSchedule200> => {
      return callScheduleControllerUpdateCallSchedule(arg);
    };
  };
export const getCallScheduleControllerUpdateCallScheduleMutationKey = () =>
  [`/call-schedule`] as const;

export type CallScheduleControllerUpdateCallScheduleMutationResult =
  NonNullable<
    Awaited<ReturnType<typeof callScheduleControllerUpdateCallSchedule>>
  >;
export type CallScheduleControllerUpdateCallScheduleMutationError = unknown;

export const useCallScheduleControllerUpdateCallSchedule = <
  TError = unknown
>(options?: {
  swr?: SWRMutationConfiguration<
    Awaited<ReturnType<typeof callScheduleControllerUpdateCallSchedule>>,
    TError,
    Key,
    CallScheduleControllerUpdateCallScheduleBody,
    Awaited<ReturnType<typeof callScheduleControllerUpdateCallSchedule>>
  > & { swrKey?: string };
}) => {
  const { swr: swrOptions } = options ?? {};

  const swrKey =
    swrOptions?.swrKey ??
    getCallScheduleControllerUpdateCallScheduleMutationKey();
  const swrFn = getCallScheduleControllerUpdateCallScheduleMutationFetcher();

  const query = useSWRMutation(swrKey, swrFn, swrOptions);

  return {
    swrKey,
    ...query,
  };
};

export const userControllerSignUp = (
  userControllerSignUpBody: UserControllerSignUpBody
) => {
  return customFetcher<void>({
    url: `/users/signup`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: userControllerSignUpBody,
  });
};

export const getUserControllerSignUpMutationFetcher = () => {
  return (
    _: Key,
    { arg }: { arg: UserControllerSignUpBody }
  ): Promise<void> => {
    return userControllerSignUp(arg);
  };
};
export const getUserControllerSignUpMutationKey = () =>
  [`/users/signup`] as const;

export type UserControllerSignUpMutationResult = NonNullable<
  Awaited<ReturnType<typeof userControllerSignUp>>
>;
export type UserControllerSignUpMutationError = unknown;

export const useUserControllerSignUp = <TError = unknown>(options?: {
  swr?: SWRMutationConfiguration<
    Awaited<ReturnType<typeof userControllerSignUp>>,
    TError,
    Key,
    UserControllerSignUpBody,
    Awaited<ReturnType<typeof userControllerSignUp>>
  > & { swrKey?: string };
}) => {
  const { swr: swrOptions } = options ?? {};

  const swrKey = swrOptions?.swrKey ?? getUserControllerSignUpMutationKey();
  const swrFn = getUserControllerSignUpMutationFetcher();

  const query = useSWRMutation(swrKey, swrFn, swrOptions);

  return {
    swrKey,
    ...query,
  };
};

export const userControllerGetUser = () => {
  return customFetcher<UserControllerGetUser200>({
    url: `/users`,
    method: "GET",
  });
};

export const getUserControllerGetUserKey = () => [`/users`] as const;

export type UserControllerGetUserQueryResult = NonNullable<
  Awaited<ReturnType<typeof userControllerGetUser>>
>;
export type UserControllerGetUserQueryError = unknown;

export const useUserControllerGetUser = <TError = unknown>(options?: {
  swr?: SWRConfiguration<
    Awaited<ReturnType<typeof userControllerGetUser>>,
    TError
  > & { swrKey?: Key; enabled?: boolean };
}) => {
  const { swr: swrOptions } = options ?? {};

  const isEnabled = swrOptions?.enabled !== false;
  const swrKey =
    swrOptions?.swrKey ??
    (() => (isEnabled ? getUserControllerGetUserKey() : null));
  const swrFn = () => userControllerGetUser();

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(
    swrKey,
    swrFn,
    swrOptions
  );

  return {
    swrKey,
    ...query,
  };
};

export const userControllerResignUser = () => {
  return customFetcher<void>({ url: `/users`, method: "DELETE" });
};

export const getUserControllerResignUserMutationFetcher = () => {
  return (_: Key, __: { arg: Arguments }): Promise<void> => {
    return userControllerResignUser();
  };
};
export const getUserControllerResignUserMutationKey = () => [`/users`] as const;

export type UserControllerResignUserMutationResult = NonNullable<
  Awaited<ReturnType<typeof userControllerResignUser>>
>;
export type UserControllerResignUserMutationError = unknown;

export const useUserControllerResignUser = <TError = unknown>(options?: {
  swr?: SWRMutationConfiguration<
    Awaited<ReturnType<typeof userControllerResignUser>>,
    TError,
    Key,
    Arguments,
    Awaited<ReturnType<typeof userControllerResignUser>>
  > & { swrKey?: string };
}) => {
  const { swr: swrOptions } = options ?? {};

  const swrKey = swrOptions?.swrKey ?? getUserControllerResignUserMutationKey();
  const swrFn = getUserControllerResignUserMutationFetcher();

  const query = useSWRMutation(swrKey, swrFn, swrOptions);

  return {
    swrKey,
    ...query,
  };
};

export const getTaskControllerGetTasksResponseMock =
  (): TaskControllerGetTasks200Item[] =>
    Array.from(
      { length: faker.number.int({ min: 1, max: 10 }) },
      (_, i) => i + 1
    ).map(() => ({
      id: {},
      description: faker.string.alpha(20),
      createdAt: {},
      completed: faker.datatype.boolean(),
      userId: {},
    }));

export const getCallScheduleControllerGetCallScheduleResponseMock = (
  overrideResponse: Partial<CallScheduleControllerGetCallSchedule200> = {}
): CallScheduleControllerGetCallSchedule200 => ({
  id: faker.string.uuid(),
  userId: {},
  taskCreationCallTimeUTC: faker.string.alpha(20),
  taskConfirmCallTimeUTC: faker.string.alpha(20),
  callTimeZone: faker.string.alpha(20),
  createdAt: {},
  updatedAt: {},
  ...overrideResponse,
});

export const getCallScheduleControllerUpdateCallScheduleResponseMock =
  (): CallScheduleControllerUpdateCallSchedule200 => ({});

export const getUserControllerGetUserResponseMock = (
  overrideResponse: Partial<UserControllerGetUser200> = {}
): UserControllerGetUser200 => ({ id: {}, createdAt: {}, ...overrideResponse });

export const getCallControllerInitiateCallMockHandler = (
  overrideResponse?:
    | void
    | ((
        info: Parameters<Parameters<typeof http.post>[1]>[0]
      ) => Promise<void> | void)
) => {
  return http.post("*/calls/initiate", async (info) => {
    await delay(1000);
    if (typeof overrideResponse === "function") {
      await overrideResponse(info);
    }
    return new HttpResponse(null, { status: 201 });
  });
};

export const getCallControllerInitiateCallToUserMockHandler = (
  overrideResponse?:
    | void
    | ((
        info: Parameters<Parameters<typeof http.post>[1]>[0]
      ) => Promise<void> | void)
) => {
  return http.post("*/calls/initiate-to-user", async (info) => {
    await delay(1000);
    if (typeof overrideResponse === "function") {
      await overrideResponse(info);
    }
    return new HttpResponse(null, { status: 201 });
  });
};

export const getCallControllerHandleCallWebhookMockHandler = (
  overrideResponse?:
    | void
    | ((
        info: Parameters<Parameters<typeof http.post>[1]>[0]
      ) => Promise<void> | void)
) => {
  return http.post("*/calls/webhook", async (info) => {
    await delay(1000);
    if (typeof overrideResponse === "function") {
      await overrideResponse(info);
    }
    return new HttpResponse(null, { status: 201 });
  });
};

export const getCallControllerHandleStatusCallbackMockHandler = (
  overrideResponse?:
    | void
    | ((
        info: Parameters<Parameters<typeof http.post>[1]>[0]
      ) => Promise<void> | void)
) => {
  return http.post("*/calls/status", async (info) => {
    await delay(1000);
    if (typeof overrideResponse === "function") {
      await overrideResponse(info);
    }
    return new HttpResponse(null, { status: 201 });
  });
};

export const getCallControllerHandleTodayMockHandler = (
  overrideResponse?:
    | void
    | ((
        info: Parameters<Parameters<typeof http.post>[1]>[0]
      ) => Promise<void> | void)
) => {
  return http.post("*/calls/today", async (info) => {
    await delay(1000);
    if (typeof overrideResponse === "function") {
      await overrideResponse(info);
    }
    return new HttpResponse(null, { status: 201 });
  });
};

export const getAudioControllerGetAudioMockHandler = (
  overrideResponse?:
    | void
    | ((
        info: Parameters<Parameters<typeof http.get>[1]>[0]
      ) => Promise<void> | void)
) => {
  return http.get("*/audio/:fileId", async (info) => {
    await delay(1000);
    if (typeof overrideResponse === "function") {
      await overrideResponse(info);
    }
    return new HttpResponse(null, { status: 200 });
  });
};

export const getTaskControllerGetTasksMockHandler = (
  overrideResponse?:
    | TaskControllerGetTasks200Item[]
    | ((
        info: Parameters<Parameters<typeof http.get>[1]>[0]
      ) =>
        | Promise<TaskControllerGetTasks200Item[]>
        | TaskControllerGetTasks200Item[])
) => {
  return http.get("*/tasks", async (info) => {
    await delay(1000);

    return new HttpResponse(
      JSON.stringify(
        overrideResponse !== undefined
          ? typeof overrideResponse === "function"
            ? await overrideResponse(info)
            : overrideResponse
          : getTaskControllerGetTasksResponseMock()
      ),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  });
};

export const getTaskControllerCreateTaskMockHandler = (
  overrideResponse?:
    | void
    | ((
        info: Parameters<Parameters<typeof http.post>[1]>[0]
      ) => Promise<void> | void)
) => {
  return http.post("*/tasks", async (info) => {
    await delay(1000);
    if (typeof overrideResponse === "function") {
      await overrideResponse(info);
    }
    return new HttpResponse(null, { status: 201 });
  });
};

export const getTaskControllerUpdateTaskMockHandler = (
  overrideResponse?:
    | void
    | ((
        info: Parameters<Parameters<typeof http.patch>[1]>[0]
      ) => Promise<void> | void)
) => {
  return http.patch("*/tasks/:taskId", async (info) => {
    await delay(1000);
    if (typeof overrideResponse === "function") {
      await overrideResponse(info);
    }
    return new HttpResponse(null, { status: 200 });
  });
};

export const getTaskControllerDeleteTaskMockHandler = (
  overrideResponse?:
    | void
    | ((
        info: Parameters<Parameters<typeof http.delete>[1]>[0]
      ) => Promise<void> | void)
) => {
  return http.delete("*/tasks/:taskId", async (info) => {
    await delay(1000);
    if (typeof overrideResponse === "function") {
      await overrideResponse(info);
    }
    return new HttpResponse(null, { status: 200 });
  });
};

export const getCallScheduleControllerGetCallScheduleMockHandler = (
  overrideResponse?:
    | CallScheduleControllerGetCallSchedule200
    | ((
        info: Parameters<Parameters<typeof http.get>[1]>[0]
      ) =>
        | Promise<CallScheduleControllerGetCallSchedule200>
        | CallScheduleControllerGetCallSchedule200)
) => {
  return http.get("*/call-schedule", async (info) => {
    await delay(1000);

    return new HttpResponse(
      JSON.stringify(
        overrideResponse !== undefined
          ? typeof overrideResponse === "function"
            ? await overrideResponse(info)
            : overrideResponse
          : getCallScheduleControllerGetCallScheduleResponseMock()
      ),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  });
};

export const getCallScheduleControllerUpdateCallScheduleMockHandler = (
  overrideResponse?:
    | CallScheduleControllerUpdateCallSchedule200
    | ((
        info: Parameters<Parameters<typeof http.put>[1]>[0]
      ) =>
        | Promise<CallScheduleControllerUpdateCallSchedule200>
        | CallScheduleControllerUpdateCallSchedule200)
) => {
  return http.put("*/call-schedule", async (info) => {
    await delay(1000);

    return new HttpResponse(
      JSON.stringify(
        overrideResponse !== undefined
          ? typeof overrideResponse === "function"
            ? await overrideResponse(info)
            : overrideResponse
          : getCallScheduleControllerUpdateCallScheduleResponseMock()
      ),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  });
};

export const getUserControllerSignUpMockHandler = (
  overrideResponse?:
    | void
    | ((
        info: Parameters<Parameters<typeof http.post>[1]>[0]
      ) => Promise<void> | void)
) => {
  return http.post("*/users/signup", async (info) => {
    await delay(1000);
    if (typeof overrideResponse === "function") {
      await overrideResponse(info);
    }
    return new HttpResponse(null, { status: 201 });
  });
};

export const getUserControllerGetUserMockHandler = (
  overrideResponse?:
    | UserControllerGetUser200
    | ((
        info: Parameters<Parameters<typeof http.get>[1]>[0]
      ) => Promise<UserControllerGetUser200> | UserControllerGetUser200)
) => {
  return http.get("*/users", async (info) => {
    await delay(1000);

    return new HttpResponse(
      JSON.stringify(
        overrideResponse !== undefined
          ? typeof overrideResponse === "function"
            ? await overrideResponse(info)
            : overrideResponse
          : getUserControllerGetUserResponseMock()
      ),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  });
};

export const getUserControllerResignUserMockHandler = (
  overrideResponse?:
    | void
    | ((
        info: Parameters<Parameters<typeof http.delete>[1]>[0]
      ) => Promise<void> | void)
) => {
  return http.delete("*/users", async (info) => {
    await delay(1000);
    if (typeof overrideResponse === "function") {
      await overrideResponse(info);
    }
    return new HttpResponse(null, { status: 200 });
  });
};
export const getSampleCallsAPIMock = () => [
  getCallControllerInitiateCallMockHandler(),
  getCallControllerInitiateCallToUserMockHandler(),
  getCallControllerHandleCallWebhookMockHandler(),
  getCallControllerHandleStatusCallbackMockHandler(),
  getCallControllerHandleTodayMockHandler(),
  getAudioControllerGetAudioMockHandler(),
  getTaskControllerGetTasksMockHandler(),
  getTaskControllerCreateTaskMockHandler(),
  getTaskControllerUpdateTaskMockHandler(),
  getTaskControllerDeleteTaskMockHandler(),
  getCallScheduleControllerGetCallScheduleMockHandler(),
  getCallScheduleControllerUpdateCallScheduleMockHandler(),
  getUserControllerSignUpMockHandler(),
  getUserControllerGetUserMockHandler(),
  getUserControllerResignUserMockHandler(),
];
