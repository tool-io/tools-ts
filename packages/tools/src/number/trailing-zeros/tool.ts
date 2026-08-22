import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const trailingZerosTool = createSimpleTool({
  id: "number/trailing-zeros",
  title: "Trailing Zeros Counter",
  description:
    "Count the consecutive zero digits at the end of a nonnegative integer.",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 0 }],
  outputs: [{ id: "zeros", label: "Trailing zeros", kind: "integer" }],
  calculate: (input) => {
    let remaining = input.value as number;
    let zeros = 0;
    while (remaining >= 10 && remaining % 10 === 0) {
      zeros += 1;
      remaining /= 10;
    }
    return { zeros };
  },
});
export const runTrailingZeros = trailingZerosTool.execute;
export default trailingZerosTool;

export type TrailingZerosInput = {
  readonly value: number;
};

export type TrailingZerosOutput = {
  readonly zeros: number;
};

export const trailingZerosExample = {
  input: {
    value: 1,
  },
  output: {
    zeros: 0,
  },
} satisfies ToolExample<TrailingZerosInput, TrailingZerosOutput>;
