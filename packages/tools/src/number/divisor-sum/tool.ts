import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const divisorSumTool = createSimpleTool({
  id: "number/divisor-sum",
  title: "Divisor Sum Calculator",
  description:
    "Sum the positive divisors of a positive integer via its prime factorization.",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 1 }],
  outputs: [{ id: "sum", label: "Divisor sum", kind: "integer" }],
  calculate: (input) => {
    let remaining = input.value as number;
    let sum = 1;
    for (let divisor = 2; divisor * divisor <= remaining; divisor += 1)
      if (remaining % divisor === 0) {
        let factorPower = 1;
        let geometric = 1;
        while (remaining % divisor === 0) {
          remaining /= divisor;
          factorPower *= divisor;
          geometric += factorPower;
        }
        sum *= geometric;
      }
    if (remaining > 1) sum *= 1 + remaining;
    return { sum };
  },
});
export const runDivisorSum = divisorSumTool.execute;
export default divisorSumTool;

export type DivisorSumInput = {
  readonly value: number;
};

export type DivisorSumOutput = {
  readonly sum: number;
};

export const divisorSumExample = {
  input: {
    value: 1,
  },
  output: {
    sum: 1,
  },
} satisfies ToolExample<DivisorSumInput, DivisorSumOutput>;
