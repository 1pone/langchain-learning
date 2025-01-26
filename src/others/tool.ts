import { tool } from "@langchain/core/tools";
import { z } from "zod";

const multiply = tool(
  ({ a, b }: { a: number; b: number }): number => {
    /**
     * Multiply two numbers.
     */
    return a * b;
  },
  {
    name: "multiply",
    description: "Multiply two numbers",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  },
);

console.log(await multiply.invoke({ a: 2, b: 3 }));
console.log(multiply.name); // multiply
console.log(multiply.description); // Multiply two numbers.
