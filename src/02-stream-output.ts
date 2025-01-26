import model from "./models/openAI.ts";
import {
  AIMessageChunk,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import process from "node:process";

const messages = [
  new SystemMessage("你是一个擅长写藏头诗的诗人，你的藏头诗是："),
  new HumanMessage("快发工资"),
];

// const stream = await model.stream(messages);

const stream = await model.stream("javascript 中是如何处理stream流式对象的");

let chunks: AIMessageChunk | undefined;

for await (const chunk of stream) {
  if (!chunks) chunks = chunk;
  // 消息块在设计上是可添加的，使用.concat()方法可以将它们加起来以获取迄今为止的响应状态
  else chunks = chunks.concat(chunk);

  // console.log(`${chunk.content}|`);
  process.stdout.write(chunk.content.toString()); // 使用连续的单行输出流式信息
}

console.log(chunks); // 输出最终的响应状态

model.streamEvents;
