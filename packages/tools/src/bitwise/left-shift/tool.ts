import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export const example = {
  input: { a: 3, shift: 4 },
  output: { result: 48 },
} satisfies ToolExample<{ a: number; shift: number }, { result: number }>;

export const bitwiseLeftShiftTool = createSimpleTool({
  id: "bitwise/left-shift",
  title: "Bitwise Left Shift",
  description:
    "Shift an integer's 32-bit form left by the given number of bits.",
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
      description: "Shifted value.",
      id: "result",
      kind: "integer",
      label: "Result",
    },
  ],
  calculate: (input) => {
    const result = (input.a as number) << (input.shift as number);
    if (!Number.isSafeInteger(result))
      simpleError("result", "Shifted value is not a safe integer.");
    return { result };
  },
});

export const runBitwiseLeftShift = bitwiseLeftShiftTool.execute;
export default bitwiseLeftShiftTool;
