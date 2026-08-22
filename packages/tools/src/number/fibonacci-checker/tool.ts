import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type FibonacciCheckerInput = {
  readonly value: number;
};

export type FibonacciCheckerOutput = {
  readonly isFibonacci: boolean;
};

export const fibonacciCheckerExample = {
  input: { value: 21 },
  output: { isFibonacci: true },
} satisfies ToolExample<FibonacciCheckerInput, FibonacciCheckerOutput>;

export const fibonacciCheckerTool = createSimpleTool({
  id: "number/fibonacci-checker",
  title: "Fibonacci Number Checker",
  description:
    "Check whether a nonnegative safe integer is a Fibonacci number.",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 0 }],
  outputs: [
    {
      id: "isFibonacci",
      label: "Is a Fibonacci number",
      kind: "boolean",
    },
  ],
  calculate: (input) => {
    const value = input.value as number;
    let previous = 0;
    let current = 1;
    while (previous < value) {
      if (current > value) return { isFibonacci: false };
      const next = previous + current;
      previous = current;
      current = next;
    }
    return { isFibonacci: previous === value };
  },
});
export const runFibonacciChecker = fibonacciCheckerTool.execute;
export default fibonacciCheckerTool;
