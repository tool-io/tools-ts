import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type AddTwoNumbersInput = {
  readonly first: number;
  readonly second: number;
};

export type AddTwoNumbersOutput = {
  readonly sum: number;
};

export const addTwoNumbersExample = {
  input: {
    first: 2,
    second: 3,
  },
} satisfies ToolExample<AddTwoNumbersInput>;

export const addTwoNumbersTool = createSimpleTool({
  id: "arithmetic/add-two-numbers",
  title: "Add Two Numbers Calculator",
  description: "Add two finite numbers.",
  inputs: [
    {
      description: "The first number to add.",
      id: "first",
      label: "First number",
      kind: "number",
    },
    {
      description: "The second number to add.",
      id: "second",
      label: "Second number",
      kind: "number",
    },
  ],
  outputs: [
    {
      description: "The sum of the two input numbers.",
      id: "sum",
      label: "Sum",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const sum = (input.first as number) + (input.second as number);
    return { sum };
  },
});

export const runAddTwoNumbers = addTwoNumbersTool.execute;
export default addTwoNumbersTool;
