import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly pointCount: number;
  readonly swathAreaSquareMeters: number;
  readonly overlapPercent: number;
}>;
export type Output = Readonly<{
  readonly uniqueAreaSquareMeters: number;
  readonly pointsPerSquareMeter: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.swathAreaSquareMeters <= 0 || input.overlapPercent >= 100)
    simpleError(
      "swathAreaSquareMeters",
      "Area must be positive and overlap less than 100 percent.",
      "invalid_area",
    );
  const uniqueAreaSquareMeters =
    input.swathAreaSquareMeters * (1 - input.overlapPercent / 100);
  return {
    uniqueAreaSquareMeters,
    pointsPerSquareMeter: input.pointCount / uniqueAreaSquareMeters,
  };
};

export const exampleInput = {
  pointCount: 10000,
  swathAreaSquareMeters: 2,
  overlapPercent: 20,
} satisfies Input;
export const exampleOutput = {
  uniqueAreaSquareMeters: 1.6,
  pointsPerSquareMeter: 6250,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      pointCount: input.pointCount as number,
      swathAreaSquareMeters: input.swathAreaSquareMeters as number,
      overlapPercent: input.overlapPercent as number,
    }),
  description:
    "Estimate lidar point density after a caller-supplied swath-overlap adjustment.",
  id: "laser/lidar-point-density",
  inputs: [
    {
      id: "pointCount",
      label: "Recorded point count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "swathAreaSquareMeters",
      label: "Nominal swath area",
      kind: "number",
      minimum: 0,
      unit: "m²",
    },
    {
      id: "overlapPercent",
      label: "Swath overlap",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "uniqueAreaSquareMeters",
      label: "Estimated unique area",
      kind: "number",
      minimum: 0,
      unit: "m²",
    },
    {
      id: "pointsPerSquareMeter",
      label: "Point density",
      kind: "number",
      minimum: 0,
      unit: "points/m²",
    },
  ],
  title: "Lidar Point Density",
});

export const run = tool.execute;
export default tool;
