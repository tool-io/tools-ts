import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BasalAreaGrowthAnnualInput = Readonly<{
  readonly startingBasalAreaPerHectare: number;
  readonly endingBasalAreaPerHectare: number;
  readonly elapsedYears: number;
}>;
export type BasalAreaGrowthAnnualOutput = Readonly<{
  readonly growthSquareMetersPerHectareYear: number;
}>;

export const calculateBasalAreaGrowthAnnual = (
  x: BasalAreaGrowthAnnualInput,
): BasalAreaGrowthAnnualOutput => {
  if (
    !Number.isFinite(x.startingBasalAreaPerHectare) ||
    x.startingBasalAreaPerHectare < 0
  )
    simpleError(
      "startingBasalAreaPerHectare",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.endingBasalAreaPerHectare) ||
    x.endingBasalAreaPerHectare < 0
  )
    simpleError(
      "endingBasalAreaPerHectare",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.elapsedYears) || x.elapsedYears <= 0)
    simpleError("elapsedYears", "Provide a finite positive number.");
  const growthSquareMetersPerHectareYear =
    (x.endingBasalAreaPerHectare - x.startingBasalAreaPerHectare) /
    x.elapsedYears;
  if (!Number.isFinite(growthSquareMetersPerHectareYear))
    simpleError(
      "growthSquareMetersPerHectareYear",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    growthSquareMetersPerHectareYear: Object.is(
      growthSquareMetersPerHectareYear,
      -0,
    )
      ? 0
      : growthSquareMetersPerHectareYear,
  };
};

export const example = {
  input: {
    startingBasalAreaPerHectare: 20,
    endingBasalAreaPerHectare: 22,
    elapsedYears: 2,
  },
  output: { growthSquareMetersPerHectareYear: 1 },
} satisfies ToolExample<
  BasalAreaGrowthAnnualInput,
  BasalAreaGrowthAnnualOutput
>;

export const tool = createSimpleTool({
  id: "forestry/basal-area-growth-annual",
  title: "Basal Area Growth Annual",
  description:
    "Average annual stand basal-area change in square metres per hectare.",
  inputs: [
    {
      id: "startingBasalAreaPerHectare",
      kind: "number",
      label: "Starting Basal Area Per Hectare",
      unit: "m2/ha",
      minimum: 0,
    },
    {
      id: "endingBasalAreaPerHectare",
      kind: "number",
      label: "Ending Basal Area Per Hectare",
      unit: "m2/ha",
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
      id: "growthSquareMetersPerHectareYear",
      kind: "number",
      label: "Growth Square Meters Per Hectare Year",
      unit: "m2/ha/year",
    },
  ],
  calculate: (input) =>
    calculateBasalAreaGrowthAnnual({
      startingBasalAreaPerHectare: input.startingBasalAreaPerHectare as number,
      endingBasalAreaPerHectare: input.endingBasalAreaPerHectare as number,
      elapsedYears: input.elapsedYears as number,
    }),
});
export const basalAreaGrowthAnnualTool = tool;
export const runBasalAreaGrowthAnnual = tool.execute;
export default tool;
