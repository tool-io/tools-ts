import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const clampExample = {
  input: { maximum: 10, minimum: 0, value: 12 },
} satisfies ToolExample<{
  readonly maximum: number;
  readonly minimum: number;
  readonly value: number;
}>;

export const clampTool = createSimpleTool({
  id: "arithmetic/clamp",
  title: "Clamp Number to Range",
  description: "Clamp a finite number to inclusive lower and upper bounds.",
  inputs: [
    { id: "value", label: "Value", kind: "number" },
    { id: "minimum", label: "Minimum", kind: "number" },
    { id: "maximum", label: "Maximum", kind: "number" },
  ],
  outputs: [{ id: "result", label: "Clamped value", kind: "number" }],
  calculate: (input) => {
    const minimum = input.minimum as number;
    const maximum = input.maximum as number;
    if (minimum > maximum)
      simpleError("minimum", "Minimum must not exceed maximum.");
    return {
      result: Math.min(maximum, Math.max(minimum, input.value as number)),
    };
  },
});
export const runClamp = clampTool.execute;
export default clampTool;
