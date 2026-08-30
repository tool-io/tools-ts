import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PeriodicAnnualIncrementInput = Readonly<{
  readonly startingVolumeCubicMetersPerHectare: number;
  readonly endingVolumeCubicMetersPerHectare: number;
  readonly elapsedYears: number;
}>;
export type PeriodicAnnualIncrementOutput = Readonly<{
  readonly incrementCubicMetersPerHectareYear: number;
}>;

export const calculatePeriodicAnnualIncrement = (
  x: PeriodicAnnualIncrementInput,
): PeriodicAnnualIncrementOutput => {
  if (
    !Number.isFinite(x.startingVolumeCubicMetersPerHectare) ||
    x.startingVolumeCubicMetersPerHectare < 0
  )
    simpleError(
      "startingVolumeCubicMetersPerHectare",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.endingVolumeCubicMetersPerHectare) ||
    x.endingVolumeCubicMetersPerHectare < 0
  )
    simpleError(
      "endingVolumeCubicMetersPerHectare",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.elapsedYears) || x.elapsedYears <= 0)
    simpleError("elapsedYears", "Provide a finite positive number.");
  const incrementCubicMetersPerHectareYear =
    (x.endingVolumeCubicMetersPerHectare -
      x.startingVolumeCubicMetersPerHectare) /
    x.elapsedYears;
  if (!Number.isFinite(incrementCubicMetersPerHectareYear))
    simpleError(
      "incrementCubicMetersPerHectareYear",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    incrementCubicMetersPerHectareYear: Object.is(
      incrementCubicMetersPerHectareYear,
      -0,
    )
      ? 0
      : incrementCubicMetersPerHectareYear,
  };
};

export const example = {
  input: {
    startingVolumeCubicMetersPerHectare: 100,
    endingVolumeCubicMetersPerHectare: 130,
    elapsedYears: 5,
  },
  output: { incrementCubicMetersPerHectareYear: 6 },
} satisfies ToolExample<
  PeriodicAnnualIncrementInput,
  PeriodicAnnualIncrementOutput
>;

export const tool = createSimpleTool({
  id: "forestry/periodic-annual-increment",
  title: "Periodic Annual Increment",
  description: "Average annual volume increment between two inventory dates.",
  inputs: [
    {
      id: "startingVolumeCubicMetersPerHectare",
      kind: "number",
      label: "Starting Volume Cubic Meters Per Hectare",
      unit: "m3/ha",
      minimum: 0,
    },
    {
      id: "endingVolumeCubicMetersPerHectare",
      kind: "number",
      label: "Ending Volume Cubic Meters Per Hectare",
      unit: "m3/ha",
      minimum: 0,
    },
    {
      id: "elapsedYears",
      kind: "number",
      label: "Elapsed Years",
      unit: "year",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "incrementCubicMetersPerHectareYear",
      kind: "number",
      label: "Increment Cubic Meters Per Hectare Year",
      unit: "m3/ha/year",
    },
  ],
  calculate: (input) =>
    calculatePeriodicAnnualIncrement({
      startingVolumeCubicMetersPerHectare:
        input.startingVolumeCubicMetersPerHectare as number,
      endingVolumeCubicMetersPerHectare:
        input.endingVolumeCubicMetersPerHectare as number,
      elapsedYears: input.elapsedYears as number,
    }),
});
export const periodicAnnualIncrementTool = tool;
export const runPeriodicAnnualIncrement = tool.execute;
export default tool;
