import { z } from "zod";
import model from "../models/openAI.ts";

const joke = z.object({
  setup: z.string().describe("The setup of the joke"),
  punchline: z.string().describe("The punchline to the joke"),
  rating: z.number().optional().describe("How funny the joke is, from 1 to 10"),
});

const structuredLlm = model.withStructuredOutput(joke, {
  name: "joke",
});

// const structuredLlm = model.withStructuredOutput(
//     {
//         name: "joke",
//         description: "Joke to tell user.",
//         parameters: {
//             title: "Joke",
//             type: "object",
//             properties: {
//                 setup: { type: "string", description: "The setup for the joke" },
//                 punchline: { type: "string", description: "The joke's punchline" },
//             },
//             required: ["setup", "punchline"],
//         },
//     }
// );

console.log(await structuredLlm.invoke("给我讲一个程序员的笑话"));
