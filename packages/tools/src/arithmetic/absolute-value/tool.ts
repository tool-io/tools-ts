import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const absoluteValueExample = {
  input: { value: -12.5 },
} satisfies ToolExample<{ readonly value: number }>;

export const absoluteValueTool = createSimpleTool({
  id: "arithmetic/absolute-value",
  title: "Absolute Value Calculator",
  description: "Calculate the nonnegative absolute value of a finite number.",
  inputs: [{ id: "value", label: "Value", kind: "number" }],
  outputs: [{ id: "absoluteValue", label: "Absolute value", kind: "number" }],
  calculate: (input) => ({ absoluteValue: Math.abs(input.value as number) }),
});

export const runAbsoluteValue = absoluteValueTool.execute;
export default absoluteValueTool;
