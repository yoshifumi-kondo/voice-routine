import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class CloudSchedulerAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    
    const schedulerToken = request.headers["x-scheduler-token"];
    if (!schedulerToken || schedulerToken !== process.env.SCHEDULER_TOKEN) {
      throw new UnauthorizedException("Invalid scheduler token");
    }
    return true;
  }
}
