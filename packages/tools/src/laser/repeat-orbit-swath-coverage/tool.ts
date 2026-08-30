import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly groundTracksPerRepeat: number;
  readonly swathAreaPerTrackSquareMeters: number;
  readonly referenceSurfaceAreaSquareMeters: number;
}>;
export type Output = Readonly<{
  readonly coveredAreaSquareMeters: number;
  readonly coveragePercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.referenceSurfaceAreaSquareMeters <= 0)
    simpleError(
      "referenceSurfaceAreaSquareMeters",
      "Reference area must be positive.",
      "invalid_area",
    );
  const coveredAreaSquareMeters =
    input.groundTracksPerRepeat * input.swathAreaPerTrackSquareMeters;
  return {
    coveredAreaSquareMeters,
    coveragePercent:
      (coveredAreaSquareMeters / input.referenceSurfaceAreaSquareMeters) * 100,
  };
};

export const exampleInput = {
  groundTracksPerRepeat: 10,
  swathAreaPerTrackSquareMeters: 1000000,
  referenceSurfaceAreaSquareMeters: 510000000000000,
} satisfies Input;
export const exampleOutput = {
  coveredAreaSquareMeters: 10000000,
  coveragePercent: 1.96078431372549e-6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      groundTracksPerRepeat: input.groundTracksPerRepeat as number,
      swathAreaPerTrackSquareMeters:
        input.swathAreaPerTrackSquareMeters as number,
      referenceSurfaceAreaSquareMeters:
        input.referenceSurfaceAreaSquareMeters as number,
    }),
  description:
    "Estimate nominal repeat-orbit swath coverage against a supplied reference surface area.",
  id: "laser/repeat-orbit-swath-coverage",
  inputs: [
    {
      id: "groundTracksPerRepeat",
      label: "Ground tracks per repeat",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "swathAreaPerTrackSquareMeters",
      label: "Swath area per track",
      kind: "number",
      minimum: 0,
      unit: "m²",
    },
    {
      id: "referenceSurfaceAreaSquareMeters",
      label: "Reference surface area",
      kind: "number",
      minimum: 0,
      unit: "m²",
    },
  ],
  outputs: [
    {
      id: "coveredAreaSquareMeters",
      label: "Nominal covered area",
      kind: "number",
      minimum: 0,
      unit: "m²",
    },
    {
      id: "coveragePercent",
      label: "Nominal repeat-cycle coverage",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  title: "Repeat-Orbit Swath Coverage",
});

export const run = tool.execute;
export default tool;
