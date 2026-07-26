import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ceilingToMultipleExample = {
  input: { multiple: 5, value: 13 },
} satisfies ToolExample<{
  readonly multiple: number;
  readonly value: number;
}>;

export const ceilingToMultipleTool = createSimpleTool({
  id: "arithmetic/ceiling-to-multiple",
  title: "Ceiling to Multiple Calculator",
  description: "Round a finite number upward to the nearest multiple.",
  inputs: [
    { id: "value", label: "Value", kind: "number" },
    { id: "multiple", label: "Multiple", kind: "number" },
  ],
  outputs: [{ id: "result", label: "Rounded value", kind: "number" }],
  calculate: (input) => {
    const m = input.multiple as number;
    if (m === 0) simpleError("multiple", "Multiple must not be zero.");
    return {
      result: Math.ceil((input.value as number) / Math.abs(m)) * Math.abs(m),
    };
  },
});
export const runCeilingToMultiple = ceilingToMultipleTool.execute;
export default ceilingToMultipleTool;
