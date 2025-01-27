/**
 * RunnableBranch使用对列表和一个默认可运行来初始化。
 * 它通过向每个条件传递其调用的输入来选择哪个分支。
 * 它选择第一个计算结果为 True 的条件，并使用输入运行与该条件对应的可运行。
 */
import { ChatPromptTemplate } from "@langchain/core/prompts";
import model from "./models/openAI.ts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableBranch, RunnableSequence } from "@langchain/core/runnables";
import streamLog from "./utils/steam-log.ts";

const classificationChain = ChatPromptTemplate.fromTemplate(
  `Given the user question below, classify it as either being about \`LangChain\`, \`Anthropic\`, or \`Other\`.
                                     
Do not respond with more than one word.

<question>
{question}
</question>

Classification:`,
)
  .pipe(model)
  .pipe(new StringOutputParser());

const langChainChain = ChatPromptTemplate.fromTemplate(
  `You are an expert in langchain.
Always answer questions starting with "As Harrison Chase told me".
Respond to the following question:

Question: {question}
Answer:`,
).pipe(model);

const anthropicChain = ChatPromptTemplate.fromTemplate(
  `You are an expert in anthropic. \
Always answer questions starting with "As Dario Amodei told me". \
Respond to the following question:

Question: {question}
Answer:`,
).pipe(model);

const generalChain = ChatPromptTemplate.fromTemplate(
  `Respond to the following question:

Question: {question}
Answer:`,
).pipe(model);

const branch = RunnableBranch.from([
  [
    (x: { topic: string; question: string }) =>
      x.topic.toLowerCase().includes("anthropic"),
    anthropicChain,
  ],
  [
    (x: { topic: string; question: string }) =>
      x.topic.toLowerCase().includes("langchain"),
    langChainChain,
  ],
  generalChain,
]);

const fullChain = RunnableSequence.from([
  {
    topic: classificationChain,
    question: (input: { question: string }) => input.question,
  },
  branch,
  new StringOutputParser(),
]);

const result1 = await fullChain.stream({
  question: "how do I use Anthropic?",
});

// const result2 = await fullChain.invoke({
//     question: "how do I use LangChain?",
// });
//
// const result3 = await fullChain.invoke({
//     question: "what is 2 + 2?",
// });

streamLog(result1);
