import {
  Controller,
  Post,
  Body,
  Query,
  Res,
  HttpStatus,
  InternalServerErrorException,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

import { TaskCallEvent, CallId, UserId, CallStatus } from "src/domain"; 
import { zodToOpenAPI, ZodValidationPipe } from "nestjs-zod";
import { z } from "zod";


import { CallFlow } from "src/flow/call.flow";
import { FirebaseAuthGuard } from "src/infrastructure/nest/guard/auth.guard";
import { CurrentUser } from "src/infrastructure/nest/decorator/current-user.decorator";

const mockUserId = UserId.parse("sample-user-id");

const InitiateCallZodSchema = z.object({
  to: z.string().min(1, "to is required."),
  type: z.enum(["CREATED", "CONFIRMED"]),
});
type InitiateCallZodSchema = z.infer<typeof InitiateCallZodSchema>;

const InitiateCallToUserZodSchema = z.object({
  type: z.enum(["CREATED", "CONFIRMED"]),
});

type InitiateCallToUserZodSchema = z.infer<typeof InitiateCallToUserZodSchema>;

function mapTwilioStatusToDomainStatus(status: string): CallStatus {
  switch (status) {
    case "completed":
      return "ANSWERED";
    case "no-answer":
      return "NO_ANSWER";
    case "busy":
      return "BUSY";
    case "failed":
      return "FAILED";
    default:
      throw new Error(`Unexpected call status: ${status}`);
  }
}

@ApiTags("calls")
@Controller("calls")
export class CallController {
  constructor(private readonly callFlow: CallFlow) {}

  @Post("initiate")
  async initiateCall(
    @Body(new ZodValidationPipe(InitiateCallZodSchema))
    dto: InitiateCallZodSchema
  ) {
    try {
      const callSid = await this.callFlow.initiateCall(
        dto.to,
        mockUserId,
        dto.type
      );
      return { success: true, callSid };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Post("initiate-to-user")
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: "Initiate a call to a user" })
  @ApiBody({ schema: zodToOpenAPI(InitiateCallToUserZodSchema) })
  @ApiBearerAuth()
  async initiateCallToUser(
    @Body(new ZodValidationPipe(InitiateCallToUserZodSchema))
    dto: InitiateCallToUserZodSchema,
    @CurrentUser() user: CurrentUser
  ) {
    try {
      const callSid = await this.callFlow.initiateCallToUser(
        UserId.parse(user.uid),
        dto.type
      );
      return { success: true, callSid };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Post("webhook")
  async handleCallWebhook(
    @Res() res: Response,
    @Query("type") type: TaskCallEvent,
    @Query("userId") userId: string,
    @Query("callSid") callSid: string,
    @Body()
    body: {
      CallSid: string;
      SpeechResult?: string;
      From: string;
      CallStatus: string;
    }
  ) {
    try {
      const userInput = body.SpeechResult || "";
      const sid = callSid || body.CallSid;

      console.log("Received call webhook", {
        type,
        userId,
        callSid: sid,
        userInput,
      });
      if (type === "CREATED") {
        const twiml = await this.callFlow.generateCallResponse(
          UserId.parse(userId),
          CallId.parse(sid),
          type,
          userInput
        );
        res.type("text/xml").status(HttpStatus.OK).send(twiml);
      } else if (type === "CONFIRMED") {
        const twiml = await this.callFlow.generateTodayResponse(
          UserId.parse(userId),
          CallId.parse(sid),
          userInput
        );
        res.type("text/xml").status(HttpStatus.OK).send(twiml);
      } else {
        res.status(HttpStatus.BAD_REQUEST).send("Invalid call type");
      }
    } catch (err) {
      const errorResponse = `<Response><Say language="ja-JP">エラーが発生しました</Say></Response>`;
      console.error(err);
      res.type("text/xml").status(HttpStatus.OK).send(errorResponse);
    }
  }

  @Post("status")
  async handleStatusCallback(
    @Res() res: Response,
    @Body() body: { CallSid: string; CallStatus: string }
  ) {
    try {
      
      const brandedCallId = CallId.parse(body.CallSid);
      const domainCallStatus = mapTwilioStatusToDomainStatus(body.CallStatus);
      
      await this.callFlow.handleStatusCallback(brandedCallId, domainCallStatus);
      return res.status(HttpStatus.OK).json({ message: "Status received" });
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error in status callback", error: err.message });
    }
  }

    @Post("today")
  async handleToday(
    @Res() res: Response,
    @Query("callSid") callSid: string,
    @Query("userId") userId: string,
    @Body()
    body: {
      CallSid: string;
      SpeechResult?: string;
    }
  ) {
    try {
      const userInput = body.SpeechResult || "";
      const sid = callSid || body.CallSid;
      const twiml = await this.callFlow.generateTodayResponse(
        UserId.parse(userId),
        CallId.parse(sid),
        userInput
      );
      res.type("text/xml").status(HttpStatus.OK).send(twiml);
    } catch (err) {
      console.error(err);
      const errorResponse = `<Response><Say language="ja-JP">エラーが発生しました</Say></Response>`;
      res.type("text/xml").status(HttpStatus.OK).send(errorResponse);
    }
  }
}
