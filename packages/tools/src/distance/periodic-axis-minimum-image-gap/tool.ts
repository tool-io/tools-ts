import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ left: number; right: number; period: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "Left", kind: "number" },
  { id: "right", label: "Right", kind: "number" },
  { id: "period", label: "Period", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.period);
  return H.finish({
    minimumImageGap:
      H.mod(i.right - i.left + i.period / 2, i.period) - i.period / 2,
  });
};
export const example = {
  input: { left: 1, right: 9, period: 10 },
  output: { result: { minimumImageGap: -2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "distance/periodic-axis-minimum-image-gap",
  title: "Distance: Periodic Axis Minimum Image Gap Tool",
  description:
    "Resolve a periodic-axis displacement to [-period/2,period/2), using the negative representative at exact antipodal ties.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { minimumImageGap: { type: "number" } },
        required: ["minimumImageGap"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
