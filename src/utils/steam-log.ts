import { AIMessageChunk } from "@langchain/core/messages";
import process from "node:process";
import { IterableReadableStream } from "@langchain/core/dist/utils/stream";

export default async function streamLog(stream: IterableReadableStream) {
  for await (const chunk of stream) {
    if (!chunk) process.stdout.write("\n");
    else process.stdout.write(chunk); // 使用连续的单行输出流式信息
  }
}

export async function streamAIMessageChunkLog(stream: IterableReadableStream) {
  let chunks: AIMessageChunk | undefined;

  for await (const chunk of stream) {
    if (!chunks) chunks = chunk;
    // 消息块在设计上是可添加的，使用.concat()方法可以将它们加起来以获取迄今为止的响应状态
    else chunks = chunks.concat(chunk);

    // console.log(`${chunk.content}|`);
    process.stdout.write(chunk.content.toString()); // 使用连续的单行输出流式信息
  }
  return chunks;
}
