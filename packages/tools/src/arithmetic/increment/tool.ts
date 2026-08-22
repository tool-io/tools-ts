import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const IncrementTool = createSimpleTool({
  id: "arithmetic/increment",
  title: "Increment Number",
  description: "Add one to a number.",
  inputs: [{ id: "value", label: "Value", kind: "number" }],
  outputs: [{ id: "result", label: "Result", kind: "number" }],
  calculate: (input) => {
    return { result: (input.value as number) + 1 };
  },
});
export default IncrementTool;
export const runIncrement = IncrementTool.execute;

export type IncrementInput = {
  readonly value: number;
};

export type IncrementOutput = {
  readonly result: number;
};

export const incrementExample = {
  input: {
    value: 1,
  },
  output: {
    result: 2,
  },
} satisfies ToolExample<IncrementInput, IncrementOutput>;
