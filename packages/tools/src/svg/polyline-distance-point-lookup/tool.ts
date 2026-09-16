import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  points,
  distancePoint,
} from "../batch53-shared.js";

export type Input = Readonly<{
  points: readonly (readonly number[])[];
  distance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "points", label: "Points", kind: "matrix" },
  { id: "distance", label: "Distance", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return { point: distancePoint(i.points, i.distance) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    points: [
      [0, 0],
      [3, 0],
      [3, 4],
    ],
    distance: 5,
  },
  output: { result: { point: [3, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/polyline-distance-point-lookup",
  title: "Polyline Distance Point Lookup",
  description:
    "Interpolate a point by Euclidean cumulative polyline distance without extrapolation; zero-length segments are skipped for interpolation.",
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
