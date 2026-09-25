import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  coordinate: number;
  lower: number;
  upper: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coordinate", label: "Coordinate", kind: "number" },
  { id: "lower", label: "Lower", kind: "number" },
  { id: "upper", label: "Upper", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.lower <= i.upper);
  return H.finish({
    gap: Math.max(i.lower - i.coordinate, 0, i.coordinate - i.upper),
    insideInclusive: i.coordinate >= i.lower && i.coordinate <= i.upper,
  });
};
export const example = {
  input: { coordinate: 7, lower: 2, upper: 5 },
  output: { result: { gap: 2, insideInclusive: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "distance/point-to-axis-aligned-slab-gap",
  title: "Distance: Point To Axis Aligned Slab Gap Tool",
  description:
    "Compute unsigned point-to-closed-slab separation along one axis, treating inclusive boundary coordinates as inside.",
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
          gap: { type: "number" },
          insideInclusive: { type: "boolean" },
        },
        required: ["gap", "insideInclusive"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
