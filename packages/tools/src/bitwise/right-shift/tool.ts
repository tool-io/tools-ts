import { createSimpleTool } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export const example = {
  input: { a: -16, shift: 2 },
  output: { result: -4 },
} satisfies ToolExample<{ a: number; shift: number }, { result: number }>;

export const bitwiseRightShiftTool = createSimpleTool({
  id: "bitwise/right-shift",
  title: "Bitwise Right Shift",
  description:
    "Shift an integer's 32-bit form right by the given number of bits, preserving the sign.",
  inputs: [
    {
      description: "Value to shift.",
      id: "a",
      kind: "integer",
      label: "Value",
      maximum: 2147483647,
      minimum: -2147483648,
    },
    {
      description: "Number of bit positions, 0 to 31.",
      id: "shift",
      kind: "integer",
      label: "Shift",
      maximum: 31,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Arithmetic right-shifted value.",
      id: "result",
      kind: "integer",
      label: "Result",
    },
  ],
  calculate: (input) => ({
    result: (input.a as number) >> (input.shift as number),
  }),
});

export const runBitwiseRightShift = bitwiseRightShiftTool.execute;
export default bitwiseRightShiftTool;
