import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  vector: readonly number[];
  lower: readonly number[];
  upper: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "vector", label: "Vector", kind: "numberList" },
  { id: "lower", label: "Lower", kind: "numberList" },
  { id: "upper", label: "Upper", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.vector.length === i.lower.length && i.vector.length === i.upper.length,
  );
  i.lower.forEach((x, j) => H.check(x <= i.upper[j]));
  return H.finish({
    clamped: i.vector.map((x, j) =>
      Math.min(i.upper[j], Math.max(i.lower[j], x)),
    ),
  });
};
export const example = {
  input: { vector: [-1, 5], lower: [0, 0], upper: [2, 3] },
  output: { result: { clamped: [0, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vector/vector-coordinate-clamp",
  title: "Vector: Vector Coordinate Clamp Tool",
  description:
    "Clamp each vector component to its explicitly supplied ordered per-axis bounds without fitting a normalization scale.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { clamped: { type: "array", items: { type: "number" } } },
        required: ["clamped"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
