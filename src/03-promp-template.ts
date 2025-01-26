/**
 * 提示模板是 LangChain 中的一个概念，旨在协助实现这种转换。它们接收原始用户输入并返回可传递到语言模型的数据（提示）
 */

import { ChatPromptTemplate } from "@langchain/core/prompts";
import model from "./models/openAI.ts";

const systemTemplate = "Translate the following from English to {language}";

// 模板ChatPromptTemplate支持多个消息角色language。我们将参数格式化为系统消息，将用户text 格式化为用户消息
const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["user", "{text}"],
]);

const promptValue = await promptTemplate.invoke({
  text: "Hello, how are you?",
  language: "French",
});

// 我们可以看到它返回了一个ChatPromptValue由两条消息组成的消息
console.log(promptValue.toChatMessages());
// const promptValueMessage = [
//   // SystemMessage
//   {
//     content: "Translate the following from English to French",
//     additional_kwargs: {},
//     response_metadata: {},
//   },
//   // HumanMessage
//   {
//     content: "Hello, how are you?",
//     additional_kwargs: {},
//     response_metadata: {},
//   },
// ];

// 最后，我们可以在格式化的提示上调用聊天模型：
const response = await model.invoke(promptValue);

console.log(response);
// const AIMessage = {
//   id: "chatcmpl-AskviBn7uf5JAdzNS8Rh2UDCayOTa",
//   content: "Bonjour, comment ça va ?",
//   additional_kwargs: {},
//   response_metadata: {
//     tokenUsage: {
//       promptTokens: 24,
//       completionTokens: 6,
//       totalTokens: 30,
//     },
//     finish_reason: "stop",
//     model_name: "gpt-4o-mini-2024-07-18",
//     usage: {
//       prompt_tokens: 24,
//       completion_tokens: 6,
//       total_tokens: 30,
//       completion_tokens_details: {
//         audio_tokens: 0,
//         reasoning_tokens: 0,
//       },
//       prompt_tokens_details: {
//         audio_tokens: 0,
//         cached_tokens: 0,
//       },
//     },
//     system_fingerprint: "fp_5154047bf2",
//   },
//   tool_calls: [],
//   invalid_tool_calls: [],
//   usage_metadata: {
//     output_tokens: 6,
//     input_tokens: 24,
//     total_tokens: 30,
//     input_token_details: {
//       audio: 0,
//       cache_read: 0,
//     },
//     output_token_details: {
//       audio: 0,
//       reasoning: 0,
//     },
//   },
// };
