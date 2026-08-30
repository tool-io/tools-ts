import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MeanAnnualIncrementInput = Readonly<{
  readonly volumeCubicMetersPerHectare: number;
  readonly standAgeYears: number;
}>;
export type MeanAnnualIncrementOutput = Readonly<{
  readonly incrementCubicMetersPerHectareYear: number;
}>;

export const calculateMeanAnnualIncrement = (
  x: MeanAnnualIncrementInput,
): MeanAnnualIncrementOutput => {
  if (
    !Number.isFinite(x.volumeCubicMetersPerHectare) ||
    x.volumeCubicMetersPerHectare < 0
  )
    simpleError(
      "volumeCubicMetersPerHectare",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.standAgeYears) || x.standAgeYears <= 0)
    simpleError("standAgeYears", "Provide a finite positive number.");
  const incrementCubicMetersPerHectareYear =
    x.volumeCubicMetersPerHectare / x.standAgeYears;
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
    volumeCubicMetersPerHectare: 200,
    standAgeYears: 40,
  },
  output: { incrementCubicMetersPerHectareYear: 5 },
} satisfies ToolExample<MeanAnnualIncrementInput, MeanAnnualIncrementOutput>;

export const tool = createSimpleTool({
  id: "forestry/mean-annual-increment",
  title: "Mean Annual Increment",
  description:
    "Mean annual volume increment from total stand volume and stand age.",
  inputs: [
    {
      id: "volumeCubicMetersPerHectare",
      kind: "number",
      label: "Volume Cubic Meters Per Hectare",
      unit: "m3/ha",
      minimum: 0,
    },
    {
      id: "standAgeYears",
      kind: "number",
      label: "Stand Age Years",
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
    calculateMeanAnnualIncrement({
      volumeCubicMetersPerHectare: input.volumeCubicMetersPerHectare as number,
      standAgeYears: input.standAgeYears as number,
    }),
});
export const meanAnnualIncrementTool = tool;
export const runMeanAnnualIncrement = tool.execute;
export default tool;
