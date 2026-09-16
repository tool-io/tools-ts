import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  positive,
  sum,
  points,
  polylineLengths,
  distancePoint,
} from "../batch53-shared.js";

export type Input = Readonly<{
  points: readonly (readonly number[])[];
  spacing: number;
  includeFinal: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "points", label: "Points", kind: "matrix" },
  { id: "spacing", label: "Spacing", kind: "number" },
  { id: "includeFinal", label: "Include final", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const total = sum(polylineLengths(i.points));
  positive(i.spacing, "spacing");
  bounded(Math.floor(total / i.spacing), "samples", 0, 9999);
  const distances = Array.from(
    { length: Math.floor(total / i.spacing) + 1 },
    (_, j) => j * i.spacing,
  );
  if (i.includeFinal && distances.at(-1)! < total) distances.push(total);
  return {
    distances,
    points: distances.map((d) => distancePoint(i.points, d)),
  };
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
    ],
    spacing: 2,
    includeFinal: true,
  },
  output: {
    result: {
      distances: [0, 2, 3],
      points: [
        [0, 0],
        [2, 0],
        [3, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/polyline-uniform-distance-resampler",
  title: "Polyline Uniform Distance Resampler",
  description:
    "Resample a finite polyline at regular arc-distance spacing with an explicit optional final vertex, bounded to 10,000 samples.",
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
