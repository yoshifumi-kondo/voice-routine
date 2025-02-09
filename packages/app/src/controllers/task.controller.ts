import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { TaskManageFlow } from "src/flow/task-manage.flow";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";

import { ZodValidationPipe, zodToOpenAPI } from "nestjs-zod";
import { z } from "zod";
import { FirebaseAuthGuard } from "src/infrastructure/nest/guard/auth.guard";
import { CurrentUser } from "src/infrastructure/nest/decorator/current-user.decorator";
import { TaskId, TaskPropsSchema } from "src/domain";


const CreateTaskBodyZodSchema = z.object({
  description: z.string().min(1, "description is required"),
});
type CreateTaskBody = z.infer<typeof CreateTaskBodyZodSchema>;

const UpdateTaskBodyZodSchema = z.object({
  completed: z.boolean().optional(),
  description: z.string().optional(),
});
type UpdateTaskBody = z.infer<typeof UpdateTaskBodyZodSchema>;

@ApiTags("tasks")
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller("tasks")
export class TaskController {
  constructor(private readonly taskManageFlow: TaskManageFlow) {}

    @Get()
  @ApiOperation({ summary: "Get tasks for the authenticated user" })
  @ApiResponse({
    status: 200,
    description: "Return list of tasks.",
    schema: zodToOpenAPI(z.array(TaskPropsSchema)),
  })
  async getTasks(@CurrentUser() user: CurrentUser) {
    
    return this.taskManageFlow.getTasksForUser(user.uid);
  }

    @Post()
  @ApiOperation({ summary: "Create a new task for the authenticated user" })
  @ApiBody({ schema: zodToOpenAPI(CreateTaskBodyZodSchema) })
  async createTask(
    @CurrentUser() user: CurrentUser,
    @Body(new ZodValidationPipe(CreateTaskBodyZodSchema))
    body: CreateTaskBody
  ) {
    return this.taskManageFlow.createTaskForUser(user.uid, body.description);
  }

    @Patch(":taskId")
  @ApiParam({
    name: "taskId",
    required: true,
    type: "string",
  })
  @ApiOperation({ summary: "Update a task (e.g. mark as completed)" })
  @ApiBody({ schema: zodToOpenAPI(UpdateTaskBodyZodSchema) })
  async updateTask(
    @Param("taskId") taskId: string,
    @Body(new ZodValidationPipe(UpdateTaskBodyZodSchema))
    body: UpdateTaskBody,
    @CurrentUser() user: CurrentUser
  ) {
    try {
      const updated = await this.taskManageFlow.updateTask(
        user.uid,
        TaskId.parse(taskId),
        body
      );
      return updated;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

    @Delete(":taskId")
  @ApiOperation({ summary: "Delete a task" })
  @ApiParam({
    name: "taskId",
    required: true,
    type: "string",
  })
  async deleteTask(@Param("taskId") taskId: string) {
    try {
      await this.taskManageFlow.deleteTask(TaskId.parse(taskId));
      return { success: true };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }
}
