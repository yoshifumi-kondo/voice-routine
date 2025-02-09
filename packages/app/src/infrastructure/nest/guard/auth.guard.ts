import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import * as admin from "firebase-admin";
import { UserId } from "src/domain";
import { UserFlow } from "src/flow/user.flow";
import { CurrentUser } from "src/infrastructure/nest/decorator/current-user.decorator";

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly userFlow: UserFlow) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException("Authorization ヘッダーがありません");
    }
    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      throw new UnauthorizedException("無効なトークン形式です");
    }
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      const { uid } = decodedToken;

      const user = await this.userFlow.getUser({ userId: UserId.parse(uid) });

      if (!user) {
        throw new UnauthorizedException("ユーザーが見つかりません");
      }
      const currentUser: CurrentUser = { ...decodedToken, uid: user.id };
      request.user = currentUser;
      return true;
    } catch (error) {
      throw new UnauthorizedException("トークンの検証に失敗しました");
    }
  }
}
