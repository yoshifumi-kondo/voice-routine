import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Twilio } from "twilio";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { TaskCallEvent, UserId } from "src/domain";

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);
  private client: Twilio;

  
  private callAudioMap: Map<string, string[]> = new Map();

  constructor(private readonly configService: ConfigService) {
    this.client = new Twilio(
      this.configService.get<string>("TWILIO_ACCOUNT_SID") || "",
      this.configService.get<string>("TWILIO_AUTH_TOKEN") || ""
    );
  }

  async makeCall(
    to: string,
    type: TaskCallEvent,
    userId: UserId
  ): Promise<string> {
    try {
      const webhookUrl = this.configService.get("TWILIO_WEBHOOK_URL");
      const from = this.configService.get("TWILIO_PHONE_NUMBER");

      const call = await this.client.calls.create({
        url: `${webhookUrl}/calls/webhook?type=${type}&userId=${userId}`,
        to,
        from,
        statusCallback: `${webhookUrl}/calls/status`,
        statusCallbackEvent: ["completed", "no-answer", "busy", "failed"],
      });
      this.callAudioMap.set(call.sid, []);
      return call.sid;
    } catch (error) {
      this.logger.error("Error making Twilio call:", error);
      throw new Error("Failed to initiate call");
    }
  }

    handleStatusCallback(body: { CallSid: string; CallStatus: string }) {
    const callSid = body.CallSid;
    const callStatus = body.CallStatus;
    this.logger.log(`Status callback: ${callSid}, status=${callStatus}`);

    const ended = ["completed", "no-answer", "busy", "failed"];
    if (ended.includes(callStatus)) {
      const fileList = this.callAudioMap.get(callSid) || [];
      for (const fileId of fileList) {
        const tmpPath = path.join(os.tmpdir(), fileId);
        if (fs.existsSync(tmpPath)) {
          fs.unlinkSync(tmpPath);
        }
      }
      this.callAudioMap.delete(callSid);
    }
  }
}
