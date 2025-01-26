import { tool } from "@langchain/core/tools";
import { z } from "zod";
import model from "./models/openAI.ts";

/**
 * Note that the descriptions here are crucial, as they will be passed along
 * to the model along with the class name.
 */
const calculatorSchema = z.object({
  operation: z
    .enum(["add", "subtract", "multiply", "divide"])
    .describe("The type of operation to execute."),
  number1: z.number().describe("The first number to operate on."),
  number2: z.number().describe("The second number to operate on."),
});

const calculatorTool = tool(
  async ({ operation, number1, number2 }) => {
    // Functions must return strings
    if (operation === "add") {
      return `${number1 + number2}`;
    } else if (operation === "subtract") {
      return `${number1 - number2}`;
    } else if (operation === "multiply") {
      return `${number1 * number2}`;
    } else if (operation === "divide") {
      return `${number1 / number2}`;
    } else {
      throw new Error("Invalid operation.");
    }
  },
  {
    name: "calculator-01",
    description: "Can perform mathematical operations.",
    schema: calculatorSchema,
  },
);

const llmWithTools = model.bindTools([
  calculatorTool,
  {
    type: "function",
    function: {
      name: "calculator-02",
      description: "Can perform mathematical operations.",
      parameters: {
        type: "object",
        properties: {
          operation: {
            type: "string",
            description: "The type of operation to execute.",
            enum: ["add", "subtract", "multiply", "divide"],
          },
          number1: { type: "number", description: "First integer" },
          number2: { type: "number", description: "Second integer" },
        },
        required: ["number1", "number2"],
      },
    },
  },
]);

const res = await llmWithTools.invoke("What is 3 * 12");
// const res = await llmWithTools.invoke("What is 2 power 3"); // It will not have toll calls

console.log(res);
