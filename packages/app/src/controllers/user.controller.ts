
import {
  Controller,
  Post,
  Delete,
  Body,
  HttpException,
  HttpStatus,
  Get,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from "@nestjs/swagger";
import { zodToOpenAPI, ZodValidationPipe } from "nestjs-zod";
import { z } from "zod";
import { UserFlow } from "src/flow/user.flow";
import { CurrentUser } from "src/infrastructure/nest/decorator/current-user.decorator";
import { UserDomain, UserPropsSchema } from "src/domain";
import { FirebaseAuthGuard } from "src/infrastructure/nest/guard/auth.guard";

const SignUpUserSchema = z.object({
  token: z.string().min(1, "Token is required"),
});
type SignUpUserDto = z.infer<typeof SignUpUserSchema>;

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(private readonly userFlow: UserFlow) {}

    @Post("signup")
  @ApiOperation({ summary: "Sign up a new user using Firebase token" })
  @ApiBody({ schema: zodToOpenAPI(SignUpUserSchema) })
  @ApiResponse({ status: 201, description: "User signed up successfully" })
  async signUp(
    @Body(new ZodValidationPipe(SignUpUserSchema)) dto: SignUpUserDto
  ): Promise<{ message: string }> {
    try {
      await this.userFlow.signUpUser({ token: dto.token });
      return { message: "User signed up successfully" };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get a user by userId" })
  @ApiResponse({
    status: 200,
    description: "User found",
    schema: zodToOpenAPI(UserPropsSchema),
  })
  @UseGuards(FirebaseAuthGuard)
  async getUser(@CurrentUser() user: CurrentUser): Promise<UserDomain> {
    try {
      return await this.userFlow.getUser({ userId: user.uid });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

    @Delete()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Resign (delete) a user by userId" })
  @ApiResponse({ status: 200, description: "User resigned successfully" })
  @UseGuards(FirebaseAuthGuard)
  async resignUser(
    @CurrentUser() user: CurrentUser
  ): Promise<{ message: string }> {
    try {
      await this.userFlow.resignUser({ userId: user.uid });
      return { message: "User resigned successfully" };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
