import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ElevationDifferencePointsInput = Readonly<{
  readonly firstElevationMeters: number;
  readonly secondElevationMeters: number;
}>;
export type ElevationDifferencePointsOutput = Readonly<{
  readonly differenceMeters: number;
}>;

export const calculateElevationDifferencePoints = (
  x: ElevationDifferencePointsInput,
): ElevationDifferencePointsOutput => {
  if (!Number.isFinite(x.firstElevationMeters))
    simpleError("firstElevationMeters", "Provide a finite number.");
  if (!Number.isFinite(x.secondElevationMeters))
    simpleError("secondElevationMeters", "Provide a finite number.");
  const differenceMeters = x.secondElevationMeters - x.firstElevationMeters;
  if (!Number.isFinite(differenceMeters))
    simpleError(
      "differenceMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    differenceMeters: Object.is(differenceMeters, -0) ? 0 : differenceMeters,
  };
};

export const example = {
  input: {
    firstElevationMeters: 120,
    secondElevationMeters: 95,
  },
  output: { differenceMeters: -25 },
} satisfies ToolExample<
  ElevationDifferencePointsInput,
  ElevationDifferencePointsOutput
>;

export const tool = createSimpleTool({
  id: "cartography/elevation-difference-points",
  title: "Elevation Difference Points",
  description:
    "Signed elevation change from the first point to the second, in metres.",
  inputs: [
    {
      id: "firstElevationMeters",
      kind: "number",
      label: "First Elevation Meters",
      unit: "m",
    },
    {
      id: "secondElevationMeters",
      kind: "number",
      label: "Second Elevation Meters",
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "differenceMeters",
      kind: "number",
      label: "Difference Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateElevationDifferencePoints({
      firstElevationMeters: input.firstElevationMeters as number,
      secondElevationMeters: input.secondElevationMeters as number,
    }),
});
export const elevationDifferencePointsTool = tool;
export const runElevationDifferencePoints = tool.execute;
export default tool;
