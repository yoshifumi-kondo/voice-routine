# Stage 1: Builder
FROM oven/bun:latest AS builder
WORKDIR /app

# 必要なファイルをコピーして依存関係をインストール
COPY package.json ./
RUN bun install

# 残りのファイルをコピー
COPY . .

# Prisma Client の生成（マイグレーションは実行しない）
RUN bunx prisma generate --schema=./prisma/schema.prisma

# NestJS のビルドと、tsc-alias の実行
RUN bun run build && bunx tsc-alias

# Stage 2: Production
FROM oven/bun:latest AS production
WORKDIR /app

# プロダクション用環境変数を設定
ENV NODE_ENV production
ENV PORT 8080

COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 8080

CMD ["bun", "dist/main.js"]
