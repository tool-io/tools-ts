import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const NegateTool = createSimpleTool({
  id: "arithmetic/negate",
  title: "Negate Number",
  description: "Return the negation of a number.",
  inputs: [{ id: "value", label: "Value", kind: "number" }],
  outputs: [{ id: "negated", label: "Negated value", kind: "number" }],
  calculate: (input) => {
    return { negated: -(input.value as number) };
  },
});
export default NegateTool;
export const runNegate = NegateTool.execute;

export type NegateInput = {
  readonly value: number;
};

export type NegateOutput = {
  readonly negated: number;
};

export const negateExample = {
  input: {
    value: 1,
  },
  output: {
    negated: -1,
  },
} satisfies ToolExample<NegateInput, NegateOutput>;
