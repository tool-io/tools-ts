import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const divisorCountTool = createSimpleTool({
  id: "number/divisor-count",
  title: "Divisor Count Calculator",
  description:
    "Count the positive divisors of a positive integer via its prime factorization.",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 1 }],
  outputs: [{ id: "divisors", label: "Divisor count", kind: "integer" }],
  calculate: (input) => {
    let remaining = input.value as number;
    let count = 1;
    for (let divisor = 2; divisor * divisor <= remaining; divisor += 1)
      if (remaining % divisor === 0) {
        let exponent = 0;
        while (remaining % divisor === 0) {
          exponent += 1;
          remaining /= divisor;
        }
        count *= exponent + 1;
      }
    if (remaining > 1) count *= 2;
    return { divisors: count };
  },
});
export const runDivisorCount = divisorCountTool.execute;
export default divisorCountTool;

export type DivisorCountInput = {
  readonly value: number;
};

export type DivisorCountOutput = {
  readonly divisors: number;
};

export const divisorCountExample = {
  input: {
    value: 1,
  },
  output: {
    divisors: 1,
  },
} satisfies ToolExample<DivisorCountInput, DivisorCountOutput>;
