import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import * as admin from "firebase-admin";
import { UserId } from "src/domain";

export type CurrentUser = admin.auth.DecodedIdToken & { uid: UserId };

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): admin.auth.DecodedIdToken => {
    const request = ctx.switchToHttp().getRequest();
    const userId = UserId.parse(request.user.uid);
    return { ...request.user, uid: userId };
  }
);
