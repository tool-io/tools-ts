import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const properDivisorSum = (value: number): number => {
  if (value === 1) return 0;
  let total = 1;
  for (let factor = 2; factor * factor <= value; factor += 1)
    if (value % factor === 0) {
      const paired = value / factor;
      total += factor === paired ? factor : factor + paired;
    }
  return total;
};

export const perfectNumberCheckerTool = createSimpleTool({
  id: "number/perfect-number-checker",
  title: "Perfect Number Checker",
  description:
    "Check whether the sum of the proper divisors of a positive integer equals the integer.",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 1 }],
  outputs: [{ id: "perfect", label: "Perfect number", kind: "boolean" }],
  calculate: (input) => {
    const value = input.value as number;
    return { perfect: properDivisorSum(value) === value };
  },
});
export const runPerfectNumberChecker = perfectNumberCheckerTool.execute;
export default perfectNumberCheckerTool;

export type PerfectNumberCheckerInput = {
  readonly value: number;
};

export type PerfectNumberCheckerOutput = {
  readonly perfect: boolean;
};

export const perfectNumberCheckerExample = {
  input: {
    value: 1,
  },
  output: {
    perfect: false,
  },
} satisfies ToolExample<PerfectNumberCheckerInput, PerfectNumberCheckerOutput>;
