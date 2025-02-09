import { Injectable } from "@nestjs/common";
import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";
import { ConfigService } from "@nestjs/config";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class SpeechService {
  private textToSpeech: TextToSpeechClient;
  private twilioWebhookUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.textToSpeech = new TextToSpeechClient();
    this.twilioWebhookUrl = this.configService.get("TWILIO_WEBHOOK_URL") || "";
  }

  async generateAudioFromText(text: string): Promise<string> {
    const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest =
      {
        input: { text },
        voice: {
          languageCode: "ja-JP",
          name: "ja-JP-Neural2-B",
        },
        audioConfig: {
          audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
        },
      };

    const [response] = await this.textToSpeech.synthesizeSpeech(request);
    if (!response.audioContent) {
      throw new Error("No audioContent");
    }

    const fileId = `${uuidv4()}.mp3`;
    const tmpDir = os.tmpdir();
    const filePath = path.join(tmpDir, fileId);

    fs.writeFileSync(filePath, response.audioContent, "binary");
    console.log(`Audio file saved to: ${filePath}`);

    const publicUrl = `${this.twilioWebhookUrl}/audio/${fileId}`;
    return publicUrl;
  }
}
