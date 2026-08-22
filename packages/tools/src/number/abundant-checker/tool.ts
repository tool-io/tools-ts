import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const properDivisorSum = (value: number): number => {
  let total = 1;
  for (let factor = 2; factor * factor <= value; factor += 1)
    if (value % factor === 0) {
      const paired = value / factor;
      total += factor === paired ? factor : factor + paired;
    }
  return total;
};

export const abundantCheckerTool = createSimpleTool({
  id: "number/abundant-checker",
  title: "Abundant Number Checker",
  description:
    "Check whether the sum of the proper divisors of a positive integer exceeds the integer.",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 1 }],
  outputs: [{ id: "abundant", label: "Abundant number", kind: "boolean" }],
  calculate: (input) => {
    const value = input.value as number;
    return { abundant: properDivisorSum(value) > value };
  },
});
export const runAbundantChecker = abundantCheckerTool.execute;
export default abundantCheckerTool;

export type AbundantCheckerInput = {
  readonly value: number;
};

export type AbundantCheckerOutput = {
  readonly abundant: boolean;
};

export const abundantCheckerExample = {
  input: {
    value: 1,
  },
  output: {
    abundant: false,
  },
} satisfies ToolExample<AbundantCheckerInput, AbundantCheckerOutput>;
