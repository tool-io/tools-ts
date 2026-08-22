import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const DecrementTool = createSimpleTool({
  id: "arithmetic/decrement",
  title: "Decrement Number",
  description: "Subtract one from a number.",
  inputs: [{ id: "value", label: "Value", kind: "number" }],
  outputs: [{ id: "result", label: "Result", kind: "number" }],
  calculate: (input) => {
    return { result: (input.value as number) - 1 };
  },
});
export default DecrementTool;
export const runDecrement = DecrementTool.execute;

export type DecrementInput = {
  readonly value: number;
};

export type DecrementOutput = {
  readonly result: number;
};

export const decrementExample = {
  input: {
    value: 1,
  },
  output: {
    result: 0,
  },
} satisfies ToolExample<DecrementInput, DecrementOutput>;
