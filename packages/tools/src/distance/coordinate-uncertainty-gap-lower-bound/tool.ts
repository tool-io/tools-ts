import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  firstCenter: number;
  firstHalfwidth: number;
  secondCenter: number;
  secondHalfwidth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstCenter", label: "First center", kind: "number" },
  { id: "firstHalfwidth", label: "First halfwidth", kind: "number" },
  { id: "secondCenter", label: "Second center", kind: "number" },
  { id: "secondHalfwidth", label: "Second halfwidth", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.firstHalfwidth >= 0 && i.secondHalfwidth >= 0);
  return H.finish({
    minimumPossibleGap: Math.max(
      0,
      Math.abs(i.firstCenter - i.secondCenter) -
        i.firstHalfwidth -
        i.secondHalfwidth,
    ),
    intervalsOverlap:
      Math.abs(i.firstCenter - i.secondCenter) <=
      i.firstHalfwidth + i.secondHalfwidth,
  });
};
export const example = {
  input: {
    firstCenter: 0,
    firstHalfwidth: 1,
    secondCenter: 5,
    secondHalfwidth: 2,
  },
  output: { result: { minimumPossibleGap: 2, intervalsOverlap: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "distance/coordinate-uncertainty-gap-lower-bound",
  title: "Distance: Coordinate Uncertainty Gap Lower Bound Tool",
  description:
    "Compute sharp one-axis separation lower bound for two explicit closed uncertainty intervals; no probability distribution or coverage claim.",
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
          intervalsOverlap: { type: "boolean" },
          minimumPossibleGap: { type: "number" },
        },
        required: ["intervalsOverlap", "minimumPossibleGap"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
