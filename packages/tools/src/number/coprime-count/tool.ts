import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const coprimeCountTool = createSimpleTool({
  id: "number/coprime-count",
  title: "Coprime Count Calculator",
  description:
    "Count the positive integers up to a positive integer that are coprime to it (Euler totient).",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 1 }],
  outputs: [{ id: "coprimes", label: "Coprime count", kind: "integer" }],
  calculate: (input) => {
    let remaining = input.value as number;
    let totient = remaining;
    for (let divisor = 2; divisor * divisor <= remaining; divisor += 1)
      if (remaining % divisor === 0) {
        while (remaining % divisor === 0) remaining /= divisor;
        totient -= totient / divisor;
      }
    if (remaining > 1) totient -= totient / remaining;
    return { coprimes: totient };
  },
});
export const runCoprimeCount = coprimeCountTool.execute;
export default coprimeCountTool;

export type CoprimeCountInput = {
  readonly value: number;
};

export type CoprimeCountOutput = {
  readonly coprimes: number;
};

export const coprimeCountExample = {
  input: {
    value: 1,
  },
  output: {
    coprimes: 1,
  },
} satisfies ToolExample<CoprimeCountInput, CoprimeCountOutput>;
