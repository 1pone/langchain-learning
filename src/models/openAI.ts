import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";
import { LanguageModelLike } from "@langchain/core/dist/language_models/base";

const model = new ChatOpenAI(
  {
    model: "gpt-4o-mini",
    temperature: 0,
    verbose: false,
  },
  {
    baseURL: "https://api.chatanywhere.tech/v1",
  },
) as LanguageModelLike;

export default model;
