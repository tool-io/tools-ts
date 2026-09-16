import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  sum,
  points,
  polylineLengths,
} from "../batch53-shared.js";

export type Input = Readonly<{ points: readonly (readonly number[])[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "points", label: "Points", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const lengths = polylineLengths(i.points);
  let offset = 0;
  return {
    segments: lengths.map((length, index) => {
      const startDistance = offset;
      offset += length;
      return { index, length, startDistance, endDistance: offset };
    }),
    totalLength: sum(lengths),
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
      [3, 4],
    ],
  },
  output: {
    result: {
      segments: [
        { index: 0, length: 3, startDistance: 0, endDistance: 3 },
        { index: 1, length: 4, startDistance: 3, endDistance: 7 },
      ],
      totalLength: 7,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/polyline-segment-length-table",
  title: "Polyline Segment Length Table",
  description:
    "Tabulate Euclidean polyline segment lengths and cumulative distances, retaining zero-length segments; not merely the existing total-length output.",
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
