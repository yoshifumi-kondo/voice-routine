# Stage 1: Builder
FROM oven/bun:latest AS builder
WORKDIR /app

# Cloud Build などから渡されるビルド引数を定義
ARG NEXT_PUBLIC_API_URL
ARG NEXTAUTH_SECRET

# ビルド時および Node 実行時に利用できるように環境変数として設定
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

# package.json と bun.lockb（存在する場合）をコピーして依存関係をインストール
COPY package.json bun.lockb* ./
RUN bun install

# アプリケーションコードをコピー
COPY . .

# Next.js のビルド実行（"build" スクリプトでビルド成果物を生成）
RUN bun run build


# Stage 2: Production
FROM oven/bun:latest AS production
WORKDIR /app

# Builder ステージから必要なファイルをコピー
COPY --from=builder /app/package.json /app/bun.lockb* ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# 実行時にも環境変数が必要なら、同様に設定（※必要に応じて）
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

# ポート公開（例: 3000）
EXPOSE 3000

# Next.js の "start" スクリプトでサーバー起動
CMD ["bun", "run", "start"]
