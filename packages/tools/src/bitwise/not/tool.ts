import { createSimpleTool } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export const example = {
  input: { a: 0 },
  output: { result: -1 },
} satisfies ToolExample<{ a: number }, { result: number }>;

export const bitwiseNotTool = createSimpleTool({
  id: "bitwise/not",
  title: "Bitwise NOT",
  description: "Invert every bit of an integer's 32-bit form.",
  inputs: [
    {
      description: "Operand to invert.",
      id: "a",
      kind: "integer",
      label: "A",
      maximum: 2147483647,
      minimum: -2147483648,
    },
  ],
  outputs: [
    {
      description: "Bitwise complement of the operand.",
      id: "result",
      kind: "integer",
      label: "Result",
    },
  ],
  calculate: (input) => ({ result: ~(input.a as number) }),
});

export const runBitwiseNot = bitwiseNotTool.execute;
export default bitwiseNotTool;
