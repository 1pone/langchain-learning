import model from "./models/openAI.ts";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { streamAIMessageChunkLog } from "./utils/steam-log.ts";

const messages = [
  new SystemMessage("你是一个擅长写藏头诗的诗人，你的藏头诗是："),
  new HumanMessage("快发工资"),
];

// const stream = await model.stream(messages);

const stream = await model.stream("javascript 中是如何处理stream流式对象的");

await streamAIMessageChunkLog(stream);

// console.log(chunks); // 输出最终的响应状态
