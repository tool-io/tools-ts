import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const harshadCheckerTool = createSimpleTool({
  id: "number/harshad-checker",
  title: "Harshad Number Checker",
  description:
    "Check whether a positive integer is divisible by the sum of its digits.",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 1 }],
  outputs: [{ id: "harshad", label: "Harshad number", kind: "boolean" }],
  calculate: (input) => {
    const value = input.value as number;
    let remaining = value;
    let digitSum = 0;
    while (remaining > 0) {
      digitSum += remaining % 10;
      remaining = Math.floor(remaining / 10);
    }
    return { harshad: value % digitSum === 0 };
  },
});
export const runHarshadChecker = harshadCheckerTool.execute;
export default harshadCheckerTool;

export type HarshadCheckerInput = {
  readonly value: number;
};

export type HarshadCheckerOutput = {
  readonly harshad: boolean;
};

export const harshadCheckerExample = {
  input: {
    value: 1,
  },
  output: {
    harshad: true,
  },
} satisfies ToolExample<HarshadCheckerInput, HarshadCheckerOutput>;
