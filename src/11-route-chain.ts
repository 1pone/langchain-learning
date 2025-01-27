import model from "./models/openAI.ts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";

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

const chainRouter = ({ topic }: { input: string; topic: string }) => {
  console.log("Topic: ", topic);
  if (topic.toLowerCase().includes("anthropic")) {
    return anthropicChain;
  }
  if (topic.toLowerCase().includes("langchain")) {
    return langChainChain;
  }
  return generalChain;
};

const fullChain = RunnableSequence.from([
  {
    topic: classificationChain,
    // question: (input: { question: string }) => input.question,
    question: new RunnablePassthrough(),
  },
  chainRouter,
  new StringOutputParser(),
]);

const res1 = await fullChain.invoke({ question: "What is the LangChain?" });
console.log(res1);
console.log();

const res2 = await fullChain.invoke({
  question: "how do I use Anthropic?",
});
console.log(res2);
console.log();

const res3 = await fullChain.invoke({
  question: "what is 2 + 2?",
});
console.log(res3);
