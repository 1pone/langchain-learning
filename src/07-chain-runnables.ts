import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import model from "./models/openAI.ts";
import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";

const prompt = ChatPromptTemplate.fromTemplate("tell me a joke about {topic}");

/**
 * Any two runnables can be “chained” together into sequences.
 * The output of the previous runnable’s .invoke() call is passed as input to the next runnable.
 * This can be done using the .pipe() method.
 */
const chain = prompt.pipe(model).pipe(new StringOutputParser());
// Simple chain
// const res = await chain.invoke({
//   topic: "dogs",
// });
// console.log(res);

const analysisPrompt = ChatPromptTemplate.fromTemplate(
  "is this a funny joke? {joke}",
);

// combine this chain with more runnables to create another chain.
const composedChain = new RunnableLambda({
  func: async (input: { topic: string }) => {
    const result = await chain.invoke(input);
    console.log(result);
    return { joke: result };
  },
})
  .pipe(analysisPrompt)
  .pipe(model)
  .pipe(new StringOutputParser());

const chainRes = await composedChain.invoke({ topic: "cats" });
console.log(chainRes);

/**
 * Functions will also be coerced into runnables,
 * so you can add custom logic to your chains too.
 * The below chain results in the same logical flow as before:
 */
// const composedChainWithLambda = RunnableSequence.from([
//     chain,
//     (input) => ({ joke: input }),
//     analysisPrompt,
//     model,
//     new StringOutputParser(),
// ]);
// await composedChainWithLambda.invoke({ topic: "beets" });
