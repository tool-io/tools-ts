import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const reverseInBaseTool = createSimpleTool({
  id: "number/reverse-in-base",
  title: "Reverse in Base Tool",
  description:
    "Reverse the digits of a nonnegative integer interpreted in a base between 2 and 36.",
  inputs: [
    { id: "value", label: "Integer", kind: "integer", minimum: 0 },
    { id: "base", label: "Base", kind: "integer", maximum: 36, minimum: 2 },
  ],
  outputs: [{ id: "reversed", label: "Reversed value", kind: "integer" }],
  calculate: (input) => {
    let remaining = input.value as number;
    const base = input.base as number;
    let reversed = 0;
    while (remaining > 0) {
      reversed = reversed * base + (remaining % base);
      remaining = Math.floor(remaining / base);
    }
    return { reversed };
  },
});
export const runReverseInBase = reverseInBaseTool.execute;
export default reverseInBaseTool;

export type ReverseInBaseInput = {
  readonly value: number;
  readonly base: number;
};

export type ReverseInBaseOutput = {
  readonly reversed: number;
};

export const reverseInBaseExample = {
  input: {
    value: 1,
    base: 2,
  },
  output: {
    reversed: 1,
  },
} satisfies ToolExample<ReverseInBaseInput, ReverseInBaseOutput>;
