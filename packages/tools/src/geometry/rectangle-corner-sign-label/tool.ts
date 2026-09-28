import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ xSign: number; ySign: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "xSign", label: "X sign", kind: "integer" },
  { id: "ySign", label: "Y sign", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(Math.abs(i.xSign) === 1 && Math.abs(i.ySign) === 1);
  return H.finish({
    corner:
      (i.ySign > 0 ? "upper" : "lower") +
      "-" +
      (i.xSign > 0 ? "right" : "left"),
  });
};
export const example = {
  input: { xSign: -1, ySign: 1 },
  output: { result: { corner: "upper-left" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geometry/rectangle-corner-sign-label",
  title: "Geometry: Rectangle Corner Sign Label Tool",
  description:
    "Label one rectangle corner from explicit +/-1 axis signs in a Cartesian y-up frame, not screen-coordinate inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { corner: { type: "string" } },
        required: ["corner"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
