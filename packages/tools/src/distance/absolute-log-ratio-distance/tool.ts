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
  H.positive(i.left);
  H.positive(i.right);
  return H.finish({ distance: Math.abs(Math.log(i.left) - Math.log(i.right)) });
};
export const example = {
  input: { left: 1, right: 2.718281828459045 },
  output: { result: { distance: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "distance/absolute-log-ratio-distance",
  title: "Distance: Absolute Log Ratio Distance Tool",
  description:
    "Compute natural-log ratio distance between positive scalar magnitudes with a stable log difference rather than an overflowing ratio.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { distance: { type: "number" } },
        required: ["distance"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
