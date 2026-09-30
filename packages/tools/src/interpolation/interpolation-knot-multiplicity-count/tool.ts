import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ knots: readonly number[]; target: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "knots", label: "Knots", kind: "numberList" },
  { id: "target", label: "Target", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.knots.every((x, j) => j === 0 || x >= i.knots[j - 1]));
  return H.finish({
    multiplicity: i.knots.filter((x) => x === i.target).length,
  });
};
export const example = {
  input: { knots: [0, 0, 1, 2], target: 0 },
  output: { result: { multiplicity: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interpolation/interpolation-knot-multiplicity-count",
  title: "Interpolation: Interpolation Knot Multiplicity Count Tool",
  description:
    "Count exact target multiplicity in a caller-supplied nondecreasing knot vector; no tolerance-based merging or spline fit.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { multiplicity: { type: "number" } },
        required: ["multiplicity"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
