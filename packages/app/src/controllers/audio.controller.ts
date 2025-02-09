import { Controller, Get, Param, Res } from "@nestjs/common";
import { Response } from "express";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("audio")
@Controller("audio")
export class AudioController {
  @Get(":fileId")
  getAudio(@Param("fileId") fileId: string, @Res() res: Response) {
    const tmpDir = os.tmpdir();
    const filePath = path.join(tmpDir, fileId);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found");
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
      }
    });
  }
}
