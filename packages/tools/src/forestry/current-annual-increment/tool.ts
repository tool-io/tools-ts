import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CurrentAnnualIncrementInput = Readonly<{
  readonly previousVolumeCubicMetersPerHectare: number;
  readonly currentVolumeCubicMetersPerHectare: number;
}>;
export type CurrentAnnualIncrementOutput = Readonly<{
  readonly incrementCubicMetersPerHectareYear: number;
}>;

export const calculateCurrentAnnualIncrement = (
  x: CurrentAnnualIncrementInput,
): CurrentAnnualIncrementOutput => {
  if (
    !Number.isFinite(x.previousVolumeCubicMetersPerHectare) ||
    x.previousVolumeCubicMetersPerHectare < 0
  )
    simpleError(
      "previousVolumeCubicMetersPerHectare",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.currentVolumeCubicMetersPerHectare) ||
    x.currentVolumeCubicMetersPerHectare < 0
  )
    simpleError(
      "currentVolumeCubicMetersPerHectare",
      "Provide a finite nonnegative number.",
    );
  const incrementCubicMetersPerHectareYear =
    x.currentVolumeCubicMetersPerHectare -
    x.previousVolumeCubicMetersPerHectare;
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
    previousVolumeCubicMetersPerHectare: 100,
    currentVolumeCubicMetersPerHectare: 105,
  },
  output: { incrementCubicMetersPerHectareYear: 5 },
} satisfies ToolExample<
  CurrentAnnualIncrementInput,
  CurrentAnnualIncrementOutput
>;

export const tool = createSimpleTool({
  id: "forestry/current-annual-increment",
  title: "Current Annual Increment",
  description: "One-year volume change between adjacent annual inventories.",
  inputs: [
    {
      id: "previousVolumeCubicMetersPerHectare",
      kind: "number",
      label: "Previous Volume Cubic Meters Per Hectare",
      unit: "m3/ha",
      minimum: 0,
    },
    {
      id: "currentVolumeCubicMetersPerHectare",
      kind: "number",
      label: "Current Volume Cubic Meters Per Hectare",
      unit: "m3/ha",
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
    calculateCurrentAnnualIncrement({
      previousVolumeCubicMetersPerHectare:
        input.previousVolumeCubicMetersPerHectare as number,
      currentVolumeCubicMetersPerHectare:
        input.currentVolumeCubicMetersPerHectare as number,
    }),
});
export const currentAnnualIncrementTool = tool;
export const runCurrentAnnualIncrement = tool.execute;
export default tool;
