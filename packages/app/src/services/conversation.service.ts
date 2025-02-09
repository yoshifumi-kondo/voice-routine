import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import {
  VertexAI,
  type ResponseSchema,
  SchemaType,
} from "@google-cloud/vertexai";
import { TaskDomain } from "src/domain";

@Injectable()
export class ConversationService {
  private vertexAI: VertexAI;
  private conversationModel: ReturnType<VertexAI["getGenerativeModel"]>;

  constructor(private readonly configService: ConfigService) {
    const project = this.configService.get<string>("GOOGLE_CLOUD_PROJECT");
    const location = "us-central1";

    this.vertexAI = new VertexAI({
      project,
      location,
    });

    this.conversationModel = this.vertexAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: {
        role: "system",
        parts: [
          {
            text:
              "あなたはタスク管理アシスタントです。" +
              "出力は必ずJSON形式にし、以下のレスポンススキーマを満たしてください。" +
              "可能な限りユーザーの要望を聞き、タスクをまとめてください。",
          },
        ],
      },
    });
  }

  private createStatus: Record<
    string,
    {
      phase: "ASK_PLAN" | "CONFIRM_TASKS" | "DONE";
      tasks: string[];
    }
  > = {};

  async createTodo(
    userKey: string,
    userMessage: string
  ): Promise<{
    phase: string;
    message: string;
    tasks: string[];
  }> {
    if (!this.createStatus[userKey]) {
      this.createStatus[userKey] = { phase: "ASK_PLAN", tasks: [] };
    }

    const { phase, tasks } = this.createStatus[userKey];

    const responseSchema: ResponseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        phase: {
          type: SchemaType.STRING,
          enum: ["ASK_PLAN", "CONFIRM_TASKS", "DONE"],
        },
        message: {
          type: SchemaType.STRING,
        },
        tasks: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
      },
      required: ["phase", "message"],
    };

    const promptText = `
      現在のフェーズは "${phase}" です。
      既に認識しているタスク: ${JSON.stringify(tasks)}
      ユーザー発話: "${userMessage}"
      会話のルール:
      - 出力はJSONで、必ず "phase", "message", "tasks" の3つを含む。
      - "phase" は "ASK_PLAN", "CONFIRM_TASKS", "DONE" のいずれかを設定。
      - "message" は次にユーザーへ話す文面。日本語でお願いします。
      - "tasks" は現在管理しているタスク一覧を文字列配列で。
      - ユーザーが "はい、お願いします" と言ったら、"DONE" に移行して終了メッセージを返す。
      - ユーザーが新しいタスクを言ったら tasks に追加し、"CONFIRM_TASKS" にして確認メッセージを返す。
      - フェーズが "ASK_PLAN" の場合は、「今日は何をしますか？」と聞く。
      - 必ず有効な JSON オブジェクトを返してください。Markdown のコードフェンス（jsonや）は付けないでください。
    `;

    const request = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: promptText,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.5,
        topP: 1.0,
        topK: 32,
      },
      responseMimeType: "application/json",
      responseSchema,
    };

    try {
      const result = await this.conversationModel.generateContent(request);
      const rawText =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        return {
          phase,
          message: "会話中にエラーが発生しました。",
          tasks,
        };
      }

      const cleanedText = rawText.replace(/```[\s\S]*?```/g, "").trim();

      let parsed: {
        phase: string;
        message: string;
        tasks: string[];
      };
      try {
        parsed = JSON.parse(cleanedText);
      } catch (jsonErr) {
        console.error("JSON parse error:", jsonErr, rawText);
        return {
          phase,
          message: "正しく解析できませんでした。再度お話ししてください。",
          tasks,
        };
      }

      this.createStatus[userKey].phase = parsed.phase as
        | "ASK_PLAN"
        | "CONFIRM_TASKS"
        | "DONE";
      this.createStatus[userKey].tasks = parsed.tasks || [];

      console.log({ parsed });
      return parsed;
    } catch (error) {
      console.error("VertexAI error:", error);
      return {
        phase,
        message: "要約中にエラーが発生しました。",
        tasks,
      };
    }
  }

  private updateStatus: Record<
    string,
    {
      phase: "ASK_TODAY" | "CONFIRM_TODAY" | "DONE";
      tasks: TaskDomain[];
    }
  > = {};

  async updateTodo(
    userKey: string,
    tasks: TaskDomain[],
    userMessage: string
  ): Promise<{
    phase: string;
    message: string;
    tasks: TaskDomain[];
  }> {
    if (!this.updateStatus[userKey]) {
      this.updateStatus[userKey] = {
        phase: "ASK_TODAY",
        tasks: tasks,
      };
    }

    const state = this.updateStatus[userKey];
    const { phase } = state;

    const tasksForAi = state.tasks.map((t) => ({
      description: t.description,
      completed: t.completed,
    }));

    const responseSchema: ResponseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        phase: {
          type: SchemaType.STRING,
          enum: ["ASK_TODAY", "CONFIRM_TODAY", "DONE"],
        },
        message: {
          type: SchemaType.STRING,
        },
        tasks: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              description: { type: SchemaType.STRING },
              completed: { type: SchemaType.BOOLEAN },
            },
            required: ["description", "completed"],
          },
        },
      },
      required: ["phase", "message", "tasks"],
    };

    const promptText = `
        現在のフェーズ: "${phase}"
        当日のタスク一覧(未完了を含む): ${JSON.stringify(tasksForAi)}
        ユーザー発話: "${userMessage}"

        会話のルール:
        1. このフローは「タスクの完了確認」を行うためのものです。**新しいタスクは追加しないでください**。
        2. "tasks" は { "description": string, "completed": boolean } の配列を必ず含みます。
        3. 未完了のタスクを読み上げて、ユーザーにどれが終わったか尋ねてください。
        4. ユーザーが「○○が終わった」「1番が終わった」などと言った場合は、該当するタスクの "completed" を true に設定します。
        5. "phase" は "ASK_TODAY", "CONFIRM_TODAY", "DONE" のいずれかを設定してください。
          - "ASK_TODAY": ユーザーにどれを完了したか尋ねる段階
          - "CONFIRM_TODAY": 完了したタスクを確認し、「これで全部ですか？」などと尋ねる段階
          - "DONE": すべてのタスク完了確認が終わった段階。終了メッセージを返す。
        6. ユーザーが「はい、全部終わりました」「もう大丈夫です」などと言ったら、"phase" を "DONE" にして終了メッセージを返してください。
        7. 出力形式:
          {
            "phase": "ASK_TODAY" | "CONFIRM_TODAY" | "DONE",
            "message": string,  // 次にユーザーへ話す日本語メッセージ
            "tasks": [
              { "description": "...", "completed": true/false },
              ...
            ]
          }
          - Markdownのコードブロックや追加の文字は入れないでください。純粋なJSONのみを返してください。
        8. 新しいタスクを作らないでください。あくまで "tasks" 内の既存タスクの completed フラグを更新するだけにしてください。
        9. 可能な限り簡潔に日本語で問いかけや応答を作ってください。
        10. 必ず有効な JSON オブジェクトを返してください。Markdown のコードフェンス（jsonや）は付けないでください。\`\`\`jsonは絶対に入れないでください。
      `;

    const request = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: promptText,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.5,
      },
      responseMimeType: "application/json",
      responseSchema,
    };

    try {
      const result = await this.conversationModel.generateContent(request);
      const rawText =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        return {
          phase,
          message: "AIからの応答が取得できませんでした。",
          tasks: state.tasks,
        };
      }
      const cleanedText = rawText.replace(/```[\s\S]*?```/g, "").trim();

      let parsed: {
        phase: string;
        message: string;
        tasks: Array<{ description: string; completed: boolean }>;
      };
      try {
        parsed = JSON.parse(cleanedText);
      } catch (err) {
        return {
          phase,
          message: "会話内容を解析できませんでした。",
          tasks: state.tasks,
        };
      }

      const updatedDomains = state.tasks.map((domain) => {
        const updatedAiTask = parsed.tasks.find(
          (ai) => ai.description === domain.description
        );
        if (!updatedAiTask) {
          return domain;
        }

        if (updatedAiTask.completed && !domain.completed) {
          return domain.complete();
        }
        return domain;
      });

      this.updateStatus[userKey].phase = parsed.phase as
        | "ASK_TODAY"
        | "CONFIRM_TODAY"
        | "DONE";
      this.updateStatus[userKey].tasks = updatedDomains;

      return {
        phase: parsed.phase,
        message: parsed.message,
        tasks: updatedDomains,
      };
    } catch (error) {
      console.error("VertexAI error:", error);
      return {
        phase,
        message: "要約中にエラーが発生しました。",
        tasks: state.tasks,
      };
    }
  }
}
