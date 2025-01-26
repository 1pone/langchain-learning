/**
 * 模型可以在后台使用多种策略。对于一些最受欢迎的模型提供商，
 * 包括 Anthropic、Google VertexAI、 Mistral和 OpenAI ， LangChain
 * 实现了一个通用接口，抽象出这些称为 的策略 .withStructuredOutput。
 *
 * 通过调用此方法（并传入JSON 架构或Zod 架构），
 * 模型将添加所需的任何模型参数 + 输出解析器，以返回与请求的架构匹配的结构化输出。
 * 如果模型支持多种方式（例如，函数调用与 JSON 模式） - 您可以通过传入该方法来配置要使用的方法。
 */

import { z } from "zod";
import model from "./models/openAI.ts";

const joke = z.object({
  setup: z.string().describe("The setup of the joke"),
  punchline: z.string().describe("The punchline to the joke"),
  rating: z
    .number()
    // .optional()
    .describe("How funny the joke is, from 1 to 10"),
});

/**
 * 关键点: 虽然我们将 Zod 模式设置为名为 的变量 joke，但 Zod 无法访问该变量名，
 * 因此无法将其传递给模型。虽然这不是必需的，但我们可以为我们的模式传递一个名称，
 * 以便为模型提供有关我们的模式所代表内容的额外上下文，从而提高性能
 */
const structuredLlm = model.withStructuredOutput(joke, {
  name: "joke",
  method: "json_mode",
  // includeRaw: true,
});

// const structuredLlm = model.withStructuredOutput({
//   name: "joke",
//   description: "Joke to tell user.",
//   parameters: {
//     title: "Joke",
//     type: "object",
//     properties: {
//       setup: { type: "string", description: "The setup for the joke" },
//       punchline: { type: "string", description: "The joke's punchline" },
//     },
//     required: ["setup", "punchline"],
//   },
// });

const res = await structuredLlm.invoke("Tell me a joke about cats");

console.log(res);
