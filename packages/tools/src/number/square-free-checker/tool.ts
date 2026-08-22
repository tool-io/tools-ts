import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const squareFreeCheckerTool = createSimpleTool({
  id: "number/square-free-checker",
  title: "Square-Free Checker",
  description:
    "Check whether no perfect square greater than one divides a positive integer.",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 1 }],
  outputs: [{ id: "squareFree", label: "Square-free", kind: "boolean" }],
  calculate: (input) => {
    let remaining = input.value as number;
    if (remaining % 2 === 0) {
      remaining /= 2;
      if (remaining % 2 === 0) return { squareFree: false };
    }
    for (let divisor = 3; divisor * divisor <= remaining; divisor += 2)
      if (remaining % divisor === 0) {
        remaining /= divisor;
        if (remaining % divisor === 0) return { squareFree: false };
      }
    return { squareFree: true };
  },
});
export const runSquareFreeChecker = squareFreeCheckerTool.execute;
export default squareFreeCheckerTool;

export type SquareFreeCheckerInput = {
  readonly value: number;
};

export type SquareFreeCheckerOutput = {
  readonly squareFree: boolean;
};

export const squareFreeCheckerExample = {
  input: {
    value: 1,
  },
  output: {
    squareFree: true,
  },
} satisfies ToolExample<SquareFreeCheckerInput, SquareFreeCheckerOutput>;
