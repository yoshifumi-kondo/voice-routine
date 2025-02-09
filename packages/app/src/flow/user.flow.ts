import { Injectable } from "@nestjs/common";
import { UsersService } from "src/services/user.service";
import * as admin from "firebase-admin";
import { UserDomain, UserId } from "src/domain";

@Injectable()
export class UserFlow {
  constructor(private readonly userService: UsersService) {}

  async signUpUser(params: { token: string }): Promise<void> {
    const decodedToken = await admin.auth().verifyIdToken(params.token);
    const { uid } = decodedToken;
    await this.userService.save({ id: UserId.parse(uid) });
  }

  async getUser(params: { userId: UserId }): Promise<UserDomain | null> {
    return await this.userService.findById(params.userId);
  }

  async resignUser(params: { userId: UserId }): Promise<void> {
    await this.userService.delete(params.userId);
  }
}
