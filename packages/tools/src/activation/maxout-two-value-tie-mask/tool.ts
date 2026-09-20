import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ left: number; right: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "Left", kind: "number" },
  { id: "right", label: "Right", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    maximum: Math.max(i.left, i.right),
    leftActive: i.left >= i.right,
    rightActive: i.right >= i.left,
    tie: i.left === i.right,
  });
};
export const example = {
  input: { left: 2, right: 2 },
  output: {
    result: { maximum: 2, leftActive: true, rightActive: true, tie: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "activation/maxout-two-value-tie-mask",
  title: "Activation: Maxout Two Value Tie Mask Tool",
  description:
    "Return maxout value and both active-branch flags, retaining ties rather than choosing a false unique gradient.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          leftActive: { type: "boolean" },
          maximum: { type: "number" },
          rightActive: { type: "boolean" },
          tie: { type: "boolean" },
        },
        required: ["leftActive", "maximum", "rightActive", "tie"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
