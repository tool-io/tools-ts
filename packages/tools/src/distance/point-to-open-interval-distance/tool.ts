import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ point: number; lower: number; upper: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "point", label: "Point", kind: "number" },
  { id: "lower", label: "Lower", kind: "number" },
  { id: "upper", label: "Upper", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.lower < i.upper);
  return H.finish({
    infimumDistance: Math.max(i.lower - i.point, 0, i.point - i.upper),
    attained: i.point > i.lower && i.point < i.upper,
  });
};
export const example = {
  input: { point: 0, lower: 0, upper: 2 },
  output: { result: { infimumDistance: 0, attained: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "distance/point-to-open-interval-distance",
  title: "Distance: Point To Open Interval Distance Tool",
  description:
    "Return infimum distance to a nonempty open real interval and whether the infimum is attained; boundary distance zero is not membership.",
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
          attained: { type: "boolean" },
          infimumDistance: { type: "number" },
        },
        required: ["attained", "infimumDistance"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
