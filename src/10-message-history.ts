import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
  Annotation,
} from "@langchain/langgraph";
import model from "./models/openAI.ts";
import { v4 as uuidv4 } from "uuid";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Define the function that calls the model
// const callModel = async (state: typeof MessagesAnnotation.State) => {
//   const messages = await model.invoke(state.messages);
//   // Update message history
//   return { messages };
// };

// Define a new graph
// const workflow = new StateGraph(MessagesAnnotation)
//   // Define the (single) node in the graph
//   .addNode("model", callModel)
//   .addEdge(START, "model")
//   .addEdge("model", END);

// Add memory
// const memory = new MemorySaver();
// const app = workflow.compile({ checkpointer: memory });
//
// const config = { configurable: { thread_id: uuidv4() } };
//
// const input = [
//   {
//     role: "user",
//     content: "Hi! I'm Bob.",
//   },
// ];
// const output = await app.invoke({ messages: input }, config);
// // The output contains all messages in the state.
// // This will long the last message in the conversation.
// console.log(output.messages[output.messages.length - 1]);
//
// const input2 = [
//   {
//     role: "user",
//     content: "What's my name?",
//   },
// ];
// // 请注意，不同线程的状态是分开的。同一个 thread_id保证了消息状态的一致性
// const output2 = await app.invoke({ messages: input2 }, config);
// // 以下代码因为 thread_id 不同，因此大语言模型不知道答案
// // const output2 = await app.invoke({ messages: input2 }, { configurable: { thread_id: uuidv4() } });
//
// console.log(output2.messages[output2.messages.length - 1]);

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "Answer in {language}."],
  new MessagesPlaceholder("messages"),
]);

const runnable = prompt.pipe(model).pipe(new StringOutputParser());

// Define the State
const GraphAnnotation = Annotation.Root({
  language: Annotation<string>(),
  // Spread `MessagesAnnotation` into the state to add the `messages` field.
  ...MessagesAnnotation.spec,
});

// Define the function that calls the model
const callModel2 = async (state: typeof GraphAnnotation.State) => {
  const response = await runnable.invoke(state);
  // Update message history with response:
  return { messages: [response] };
};

const workflow2 = new StateGraph(GraphAnnotation)
  .addNode("model", callModel2)
  .addEdge(START, "model")
  .addEdge("model", END);

const app2 = workflow2.compile({ checkpointer: new MemorySaver() });

const config3 = { configurable: { thread_id: uuidv4() } };
const input3 = {
  messages: [
    {
      role: "user",
      content: "My name is onePone.",
    },
  ],
  language: "中文",
};
const output3 = await app2.invoke(input3, config3);
console.log(output3.messages[output3.messages.length - 1]);

const input4 = {
  messages: [
    {
      role: "user",
      content: "What is my name?",
    },
  ],
};
const output4 = await app2.invoke(input4, config3);
console.log(output4.messages[output4.messages.length - 1]);
