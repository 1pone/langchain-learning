import { ChatOpenAI } from "@langchain/openai";
import 'dotenv/config';
const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.9
}, {
    baseURL: 'https://api.chatanywhere.tech',
});
export default model;
//# sourceMappingURL=openAI.js.map