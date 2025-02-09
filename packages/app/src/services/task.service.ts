

import { Injectable } from "@nestjs/common";
import {
  TaskDomain,
  TaskProps,
  TaskId,
  UserId,
  createTask,
  TaskRepository,
} from "../domain";

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  async findById(id: TaskId): Promise<TaskDomain | null> {
    const props = await this.taskRepository.findById(id);
    return props ? new TaskDomain(props) : null;
  }

  async save(taskProps: TaskProps): Promise<void> {
    await this.taskRepository.save(taskProps);
  }

  async bulkSave(tasks: TaskProps[]): Promise<void> {
    return await this.taskRepository.bulkSave(tasks);
  }

  async findByUserId(userId: UserId): Promise<TaskDomain[]> {
    const list = await this.taskRepository.findByUserId(userId);
    return list.map((t) => new TaskDomain(t));
  }

    async findTodaysRemainingTasks(userId: UserId): Promise<TaskDomain[]> {
    const allTasks = await this.findByUserId(userId);
    const today = new Date();
    
    return allTasks.filter((task) => {
      const d = task.createdAt;
      return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate() &&
        !task.completed
      );
    });
  }

    async updateTasks(tasks: TaskDomain[]): Promise<void> {
    for (const t of tasks) {
      await this.save(t.toObject());
    }
  }

    async createMultipleTasks(
    userId: UserId,
    descriptions: string[]
  ): Promise<TaskDomain[]> {
    const newTasks = descriptions.map((desc) =>
      createTask({ userId, description: desc })
    );
    await this.bulkSave(newTasks.map((t) => t.toObject()));
    return newTasks;
  }

  async deleteTask(taskId: TaskId): Promise<void> {
    await this.taskRepository.delete(taskId);
  }
}
