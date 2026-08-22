import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type KaprekarCheckerInput = {
  readonly value: number;
};

export type KaprekarCheckerOutput = {
  readonly isKaprekar: boolean;
};

export const kaprekarCheckerExample = {
  input: { value: 45 },
  output: { isKaprekar: true },
} satisfies ToolExample<KaprekarCheckerInput, KaprekarCheckerOutput>;

export const kaprekarCheckerTool = createSimpleTool({
  id: "number/kaprekar-checker",
  title: "Kaprekar Number Checker",
  description:
    "Check whether a positive integer's square splits into a left part and a right part of the same digit count that sum back to the integer.",
  inputs: [
    {
      description:
        "At most the largest integer whose square stays within the safe integer range.",
      id: "value",
      label: "Integer",
      kind: "integer",
      maximum: 94906265,
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "isKaprekar",
      label: "Is a Kaprekar number",
      kind: "boolean",
    },
  ],
  calculate: (input) => {
    const value = input.value as number;
    const square = value * value;
    const rightDigits = String(value).length;
    const split = 10 ** rightDigits;
    const right = square % split;
    if (right === 0) return { isKaprekar: false };
    const left = Math.floor(square / split);
    return { isKaprekar: left + right === value };
  },
});
export const runKaprekarChecker = kaprekarCheckerTool.execute;
export default kaprekarCheckerTool;
