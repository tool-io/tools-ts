import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  points,
} from "../batch53-shared.js";

export type Input = Readonly<{
  points: readonly (readonly number[])[];
  tolerance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "points", label: "Points", kind: "matrix" },
  { id: "tolerance", label: "Tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  points(i.points, 0);
  nonnegative(i.tolerance, "tolerance");
  const indexes: number[] = [];
  i.points.forEach((_, j) => {
    indexes.push(j);
    while (indexes.length >= 3) {
      const n = indexes.length,
        a = i.points[indexes[n - 3]],
        b = i.points[indexes[n - 2]],
        c = i.points[indexes[n - 1]],
        dx = c[0] - a[0],
        dy = c[1] - a[1],
        length = Math.hypot(dx, dy),
        distance = length
          ? Math.abs(dx * (b[1] - a[1]) - dy * (b[0] - a[0])) / length
          : Math.hypot(b[0] - a[0], b[1] - a[1]),
        dot = (b[0] - a[0]) * dx + (b[1] - a[1]) * dy;
      if (distance <= i.tolerance && dot >= 0 && dot <= length * length)
        indexes.splice(n - 2, 1);
      else break;
    }
  });
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
      [1, 1],
      [2, 2],
    ],
    tolerance: 0,
  },
  output: {
    result: {
      points: [
        [0, 0],
        [2, 2],
      ],
      sourceIndexes: [0, 2],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/polyline-collinear-middle-pruner",
  title: "Polyline Collinear Middle Pruner",
  description:
    "Prune middle vertices lying within a supplied perpendicular distance of the enclosing segment and between endpoints; reversals are preserved.",
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
