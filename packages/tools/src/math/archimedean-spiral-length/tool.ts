import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly initialRadius: number;
  readonly radialSlopePerRadian: number;
  readonly startAngleRadians: number;
  readonly endAngleRadians: number;
}>;
export type Output = Readonly<{ readonly spiralSegmentLength: number }>;
const inputFields = [
  { id: "initialRadius", label: "Initial radius", kind: "number" },
  {
    id: "radialSlopePerRadian",
    label: "Radial slope per radian",
    kind: "number",
  },
  { id: "startAngleRadians", label: "Start angle radians", kind: "number" },
  { id: "endAngleRadians", label: "End angle radians", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.radialSlopePerRadian, "radialSlopePerRadian");
  nonnegative(input.initialRadius, "initialRadius");
  nonnegative(input.startAngleRadians, "startAngleRadians");
  nonnegative(input.endAngleRadians, "endAngleRadians");
  if (input.endAngleRadians < input.startAngleRadians)
    simpleError("angles", "Ordered nonnegative angles required.");
  const b = input.radialSlopePerRadian,
    span = input.endAngleRadians - input.startAngleRadians,
    lo = input.initialRadius + b * input.startAngleRadians,
    delta = b * span,
    hi = lo + delta,
    hLo = Math.hypot(lo, b),
    hHi = Math.hypot(hi, b),
    slope = (hi + lo) / (hHi + hLo);
  return {
    spiralSegmentLength:
      (span / 2) * (hHi + lo * slope) +
      (b / 2) * Math.log1p((delta * (1 + slope)) / (lo + hLo)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialRadius: 0,
  radialSlopePerRadian: 1,
  startAngleRadians: 0,
  endAngleRadians: 1,
} satisfies Input;
export const exampleOutput = {
  spiralSegmentLength: 1.147793574696319,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/archimedean-spiral-length",
  title: "Archimedean Spiral Length Calculator",
  description:
    "Compute arc length of monotone Archimedean r=a+bθ for nonnegative radii/angles and positive b using exact antiderivative, distinct from MRI spiral gradient timing.",
  inputs: inputFields,
  outputs: [
    {
      id: "spiralSegmentLength",
      label: "Spiral segment length",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialRadius: value.initialRadius as number,
      radialSlopePerRadian: value.radialSlopePerRadian as number,
      startAngleRadians: value.startAngleRadians as number,
      endAngleRadians: value.endAngleRadians as number,
    }),
});
export const run = tool.execute;
export default tool;
