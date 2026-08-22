import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const semiprimeCheckerTool = createSimpleTool({
  id: "number/semiprime-checker",
  title: "Semiprime Checker",
  description:
    "Check whether a positive integer is the product of exactly two primes.",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 1 }],
  outputs: [{ id: "semiprime", label: "Semiprime", kind: "boolean" }],
  calculate: (input) => {
    let remaining = input.value as number;
    let factors = 0;
    for (let divisor = 2; divisor * divisor <= remaining; divisor += 1)
      while (remaining % divisor === 0) {
        factors += 1;
        remaining /= divisor;
      }
    if (remaining > 1) factors += 1;
    return { semiprime: factors === 2 };
  },
});
export const runSemiprimeChecker = semiprimeCheckerTool.execute;
export default semiprimeCheckerTool;

export type SemiprimeCheckerInput = {
  readonly value: number;
};

export type SemiprimeCheckerOutput = {
  readonly semiprime: boolean;
};

export const semiprimeCheckerExample = {
  input: {
    value: 1,
  },
  output: {
    semiprime: false,
  },
} satisfies ToolExample<SemiprimeCheckerInput, SemiprimeCheckerOutput>;
