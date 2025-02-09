import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import type { NestExpressApplication } from "@nestjs/platform-express";
import * as bodyParser from "body-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as fs from "node:fs";
import * as path from "node:path";
import * as yaml from "js-yaml";
import * as admin from "firebase-admin";

admin.initializeApp();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const origin =
    process.env.NODE_ENV === "production"
      ? [process.env.WEB_CLIENT_URL]
      : ["http://localhost:3000", "http://127.0.0.1:3000"];
  app.enableCors({
    origin,
  });

  app.use(bodyParser.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    if (req.path === "/calls/webhook") {
      res.header("Content-Type", "text/xml");
    }
    next();
  });

  if (process.env.NODE_ENV !== "production") {
    const config = new DocumentBuilder()
      .setTitle("Sample Calls API")
      .setDescription("API for Twilio call flow with Zod Validation")
      .setVersion("1.0")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);

    
    const outputPath = path.resolve(
      __dirname,
      "../../shared/open-api/schema.yaml"
    );
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, yaml.dump(document));

    SwaggerModule.setup("api", app, document);
  }

  const port = process.env.PORT || 8080;
  await app.listen(port);
}
bootstrap();
