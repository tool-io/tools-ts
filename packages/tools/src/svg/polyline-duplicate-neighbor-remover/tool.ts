import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, points } from "../batch53-shared.js";

export type Input = Readonly<{ points: readonly (readonly number[])[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "points", label: "Points", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  points(i.points, 0);
  const indexes = i.points.flatMap((r, j) =>
    j === 0 || r[0] !== i.points[j - 1][0] || r[1] !== i.points[j - 1][1]
      ? [j]
      : [],
  );
  return { points: indexes.map((j) => i.points[j]), sourceIndexes: indexes };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    points: [
      [0, 0],
      [0, 0],
      [1, 1],
    ],
  },
  output: {
    result: {
      points: [
        [0, 0],
        [1, 1],
      ],
      sourceIndexes: [0, 2],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/polyline-duplicate-neighbor-remover",
  title: "Polyline Duplicate Neighbor Remover",
  description:
    "Remove only consecutive exactly equal polyline vertices, retaining source indexes and nonadjacent repeats.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
