import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import model from "./models/openAI.ts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import embedding from "./embeddings/openAI.ts";

const vectorStore = await MemoryVectorStore.fromDocuments(
  [
    { pageContent: `"今天是${new Date().toLocaleDateString()}`, metadata: {} },
    {
      pageContent: "今年放假在除夕前一天",
      metadata: {},
    },
    {
      pageContent: "2025年的春节是1月29日",
      metadata: {},
    },
  ],
  embedding,
);

const retriever = vectorStore.asRetriever();

const template: string =
  "已知：{context}。请结合以上信息直接回答以下问题，问题：{question}";

const prompt = ChatPromptTemplate.fromTemplate(template);

const retrieval = RunnableSequence.from([
  {
    context: retriever.pipe((docs) =>
      docs.map((doc) => doc.pageContent).join("。"),
    ),
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);

const res = await retrieval.invoke('"还有几天可以放假？"');

console.log(res);
