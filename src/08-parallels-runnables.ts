import { PromptTemplate } from "@langchain/core/prompts";
import model from "./models/openAI.ts";
import {
  RunnableMap,
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { CohereEmbeddings } from "@langchain/cohere";
import { Document } from "@langchain/core/documents";

// const jokeChain = PromptTemplate.fromTemplate("tell me a joke about {topic}")
//   .pipe(model)
//   .pipe(new StringOutputParser());
// const poemChain = PromptTemplate.fromTemplate(
//   "write a two line poem about {topic}",
// )
//   .pipe(model)
//   .pipe(new StringOutputParser());
//
// const mapChain = RunnableMap.from({
//   joke: jokeChain,
//   poem: poemChain,
// });
// const res = await mapChain.invoke({ topic: "cats" });
//
// console.log(res);

const vectorstore = await MemoryVectorStore.fromDocuments(
  [{ pageContent: "mitochondria is the powerhouse of the cell", metadata: {} }],
  new CohereEmbeddings({ model: "embed-english-v3.0" }),
);

const retriever = vectorstore.asRetriever();
const template = `Answer the question based only on the following context:
{context}

Question: {question}`;

const prompt = PromptTemplate.fromTemplate(template);

const formatDocs = (docs: Document[]) => docs.map((doc) => doc.pageContent);

const retrievalChain = RunnableSequence.from([
  { context: retriever.pipe(formatDocs), question: new RunnablePassthrough() },
  prompt,
  model,
  new StringOutputParser(),
]);

const result = await retrievalChain.invoke(
  "what is the powerhouse of the cell?",
);
console.log(result);
