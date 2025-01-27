import { OpenAIEmbeddings } from "@langchain/openai";

const embedding = new OpenAIEmbeddings(undefined, {
  baseURL: "https://api.chatanywhere.tech/v1",
});

export default embedding;
