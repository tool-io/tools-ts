import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  left: string;
  right: string;
  mismatchCost: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "Left", kind: "string" },
  { id: "right", label: "Right", kind: "string" },
  { id: "mismatchCost", label: "Mismatch cost", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.mismatchCost >= 0);
  return H.finish({
    cost: i.left === i.right ? 0 : i.mismatchCost,
    equal: i.left === i.right,
  });
};
export const example = {
  input: { left: "a", right: "b", mismatchCost: 2 },
  output: { result: { cost: 2, equal: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "distance/discrete-symbol-mismatch-cost",
  title: "Distance: Discrete Symbol Mismatch Cost Tool",
  description:
    "Evaluate one discrete symbol equality/mismatch cost with an explicit nonnegative penalty, not edit-distance alignment.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { cost: { type: "number" }, equal: { type: "boolean" } },
        required: ["cost", "equal"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
