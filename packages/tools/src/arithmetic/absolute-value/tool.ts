import { createSimpleTool } from "../../core/simple.js";

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
