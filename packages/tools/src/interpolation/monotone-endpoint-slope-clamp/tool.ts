import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  candidateSlope: number;
  adjacentSecant: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "candidateSlope", label: "Candidate slope", kind: "number" },
  { id: "adjacentSecant", label: "Adjacent secant", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    clampedSlope:
      i.adjacentSecant === 0 || i.candidateSlope * i.adjacentSecant <= 0
        ? 0
        : Math.sign(i.adjacentSecant) *
          Math.min(Math.abs(i.candidateSlope), 3 * Math.abs(i.adjacentSecant)),
  });
};
export const example = {
  input: { candidateSlope: 5, adjacentSecant: 1 },
  output: { result: { clampedSlope: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interpolation/monotone-endpoint-slope-clamp",
  title: "Interpolation: Monotone Endpoint Slope Clamp Tool",
  description:
    "Apply a local monotone endpoint slope limiter: zero opposite-sign candidates and cap magnitude at three times the adjacent secant; not a full monotone spline fit.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { clampedSlope: { type: "number" } },
        required: ["clampedSlope"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
