import { createSimpleTool } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export const example = {
  input: { a: 12, b: 10 },
  output: { result: 8 },
} satisfies ToolExample<{ a: number; b: number }, { result: number }>;

export type BitwiseAndInput = {
  readonly a: number;
  readonly b: number;
};

export const bitwiseAndTool = createSimpleTool({
  id: "bitwise/and",
  title: "Bitwise AND",
  description: "Combine two integers with a bitwise AND on their 32-bit forms.",
  inputs: [
    {
      description: "First operand.",
      id: "a",
      kind: "integer",
      label: "A",
      maximum: 2147483647,
      minimum: -2147483648,
    },
    {
      description: "Second operand.",
      id: "b",
      kind: "integer",
      label: "B",
      maximum: 2147483647,
      minimum: -2147483648,
    },
  ],
  outputs: [
    {
      description: "Bitwise AND of the two operands.",
      id: "result",
      kind: "integer",
      label: "Result",
    },
  ],
  calculate: (input) => ({
    result: (input.a as number) & (input.b as number),
  }),
});

export const runBitwiseAnd = bitwiseAndTool.execute;
export default bitwiseAndTool;
