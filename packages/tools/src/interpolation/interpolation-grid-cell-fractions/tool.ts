import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  point: readonly number[];
  lower: readonly number[];
  upper: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "point", label: "Point", kind: "numberList" },
  { id: "lower", label: "Lower", kind: "numberList" },
  { id: "upper", label: "Upper", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.point.length > 0 &&
      i.point.length === i.lower.length &&
      i.point.length === i.upper.length,
  );
  i.point.forEach((x, j) =>
    H.check(i.upper[j] > i.lower[j] && x >= i.lower[j] && x <= i.upper[j]),
  );
  return H.finish({
    fractions: i.point.map(
      (x, j) => (x - i.lower[j]) / (i.upper[j] - i.lower[j]),
    ),
  });
};
export const example = {
  input: { point: [1, 3], lower: [0, 1], upper: [2, 5] },
  output: { result: { fractions: [0.5, 0.5] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interpolation/interpolation-grid-cell-fractions",
  title: "Interpolation: Interpolation Grid Cell Fractions Tool",
  description:
    "Compute per-axis local coordinates only inside one explicit nondegenerate axis-aligned cell; not a multidimensional interpolant or extrapolator.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { fractions: { type: "array", items: { type: "number" } } },
        required: ["fractions"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
