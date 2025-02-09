import { Injectable } from "@nestjs/common";
import { TasksService } from "src/services/task.service";
import { TaskDomain, createTask, TaskProps, TaskId, UserId } from "src/domain";

@Injectable()
export class TaskManageFlow {
  constructor(private readonly tasksService: TasksService) {}

    async getTasksForUser(userId: string): Promise<TaskProps[]> {
    const userIdBranded = UserId.parse(userId);
    const taskDomains = await this.tasksService.findByUserId(userIdBranded);
    
    return taskDomains.map((t) => t.toObject());
  }

    async createTaskForUser(
    userId: UserId,
    description: string
  ): Promise<TaskProps> {
    const userIdBranded = UserId.parse(userId);
    
    const newTask = createTask({ userId: userIdBranded, description });
    
    await this.tasksService.save(newTask.toObject());
    return newTask.toObject();
  }

    async bulkCreateTasksForUser(userId: UserId, descriptions: string[]) {
    const userIdBranded = UserId.parse(userId);
    await this.tasksService.createMultipleTasks(userIdBranded, descriptions);
  }

    async updateTask(
    userId: UserId,
    taskId: TaskId,
    patch: Partial<Pick<TaskProps, "description" | "completed">>
  ): Promise<TaskProps> {
    
    const existingDomain = await this.tasksService.findById(taskId);
    if (!existingDomain) {
      throw new Error("Task not found");
    }

    if (existingDomain.userId.toString() !== userId.toString()) {
      throw new Error("Unauthorized");
    }

    
    let updatedDomain: TaskDomain;
    if (patch.completed && !existingDomain.completed) {
      
      updatedDomain = existingDomain.complete();
    } else {
      
      const newProps = {
        ...existingDomain.toObject(),
        description: patch.description ?? existingDomain.description,
      };
      updatedDomain = new TaskDomain(newProps);
    }

    
    await this.tasksService.save(updatedDomain.toObject());
    return updatedDomain.toObject();
  }

    async deleteTask(taskId: TaskId): Promise<void> {
    await this.tasksService.deleteTask(taskId);
  }
}
