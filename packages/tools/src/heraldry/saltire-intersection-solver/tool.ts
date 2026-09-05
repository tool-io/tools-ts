import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly segmentAStart: readonly number[];
  readonly segmentAEnd: readonly number[];
  readonly segmentBStart: readonly number[];
  readonly segmentBEnd: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "segmentAStart", label: "Segment a start", kind: "numberList" },
  { id: "segmentAEnd", label: "Segment a end", kind: "numberList" },
  { id: "segmentBStart", label: "Segment b start", kind: "numberList" },
  { id: "segmentBEnd", label: "Segment b end", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  for (const p of [
    input.segmentAStart,
    input.segmentAEnd,
    input.segmentBStart,
    input.segmentBEnd,
  ])
    if (p.length !== 2) simpleError("point", "Two planar coordinates.");
  const [a, b] = input.segmentAStart,
    [c, d] = input.segmentAEnd,
    [e, f] = input.segmentBStart,
    [h, k] = input.segmentBEnd,
    den = (c - a) * (k - f) - (d - b) * (h - e);
  if (Math.abs(den) < 1e-12)
    simpleError("segments", "Parallel or unresolved intersections.");
  const t = ((e - a) * (k - f) - (f - b) * (h - e)) / den,
    u = ((e - a) * (d - b) - (f - b) * (c - a)) / den;
  if (t < 0 || t > 1 || u < 0 || u > 1)
    simpleError("intersection", "Both finite saltire segments must intersect.");
  return {
    intersection: [a + t * (c - a), b + t * (d - b)],
    firstSegmentFraction: t,
    secondSegmentFraction: u,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    segmentAStart: [0, 0],
    segmentAEnd: [100, 100],
    segmentBStart: [0, 100],
    segmentBEnd: [100, 0],
  },
  output: {
    result: {
      intersection: [50, 50],
      firstSegmentFraction: 0.5,
      secondSegmentFraction: 0.5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/saltire-intersection-solver",
  title: "Saltire Diagonal Intersection Point Solver",
  description:
    "Intersect actual finite straight saltire centerlines in one planar frame; no automatic outline extraction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
