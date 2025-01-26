import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";
import { LanguageModelLike } from "@langchain/core/dist/language_models/base";

const model = new ChatOpenAI(
  {
    model: "gpt-4o-mini",
    temperature: 0.9,
    verbose: false,
  },
  {
    baseURL: "https://api.chatanywhere.tech",
  },
) as LanguageModelLike;

export default model;
