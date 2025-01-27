// 语义相似度路由

import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { cosineSimilarity } from "@langchain/core/utils/math";
import model from "./models/openAI.ts";
import embedding from "./embeddings/openAI.ts";
import streamLog from "./utils/steam-log.ts";

const physicsTemplate = `You are a very smart physics professor.
You are great at answering questions about physics in a concise and easy to understand manner.
When you don't know the answer to a question you admit that you don't know.
Do not use more than 100 words.

Here is a question:
{query}`;

const mathTemplate = `"You are a very good mathematician. You are great at answering math questions.
You are so good because you are able to break down hard problems into their component parts,
answer the component parts, and then put them together to answer the broader question.
Do not use more than 100 words.

Here is a question:
{query}`;

const templates = [physicsTemplate, mathTemplate];
const templateEmbeddings = await embedding.embedDocuments(templates);

const promptRouter = async (query: string) => {
  const queryEmbedding = await embedding.embedQuery(query);
  // 计算查询与模板之间的余弦相似度
  const similarity = cosineSimilarity([queryEmbedding], templateEmbeddings)[0];
  const isPhysicsQuestion = similarity[0] > similarity[1];
  let promptTemplate: ChatPromptTemplate;
  if (isPhysicsQuestion) {
    console.log(`Using physics prompt`);
    promptTemplate = ChatPromptTemplate.fromTemplate(templates[0]);
  } else {
    console.log(`Using math prompt`);
    promptTemplate = ChatPromptTemplate.fromTemplate(templates[1]);
  }
  return promptTemplate.invoke({ query });
};

const chain = RunnableSequence.from([
  promptRouter,
  model,
  new StringOutputParser(),
]);

streamLog(await chain.stream("what's a black hole?"));

/*
  Using physics prompt
*/

/*
  A black hole is a region in space where the gravitational pull is so strong that nothing, not even light, can escape from it. It is the result of the gravitational collapse of a massive star, creating a singularity surrounded by an event horizon, beyond which all information is lost. Black holes have fascinated scientists for decades, as they provide insights into the most extreme conditions in the universe and the nature of gravity itself. While we understand the basic properties of black holes, there are still many unanswered questions about their behavior and their role in the cosmos.
*/

// streamLog(await chain.stream("what's a path integral?"));

/*
  Using math prompt
*/

/*
  A path integral is a mathematical formulation in quantum mechanics used to describe the behavior of a particle or system. It considers all possible paths the particle can take between two points, and assigns a probability amplitude to each path. By summing up the contributions from all paths, it provides a comprehensive understanding of the particle's quantum mechanical behavior. This approach allows for the calculation of complex quantum phenomena, such as quantum tunneling and interference effects, making it a powerful tool in theoretical physics.
*/
