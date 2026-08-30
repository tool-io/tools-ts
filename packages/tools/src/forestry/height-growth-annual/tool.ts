import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeightGrowthAnnualInput = Readonly<{
  readonly startingHeightMeters: number;
  readonly endingHeightMeters: number;
  readonly elapsedYears: number;
}>;
export type HeightGrowthAnnualOutput = Readonly<{
  readonly growthMetersPerYear: number;
}>;

export const calculateHeightGrowthAnnual = (
  x: HeightGrowthAnnualInput,
): HeightGrowthAnnualOutput => {
  if (!Number.isFinite(x.startingHeightMeters) || x.startingHeightMeters < 0)
    simpleError("startingHeightMeters", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.endingHeightMeters) || x.endingHeightMeters < 0)
    simpleError("endingHeightMeters", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.elapsedYears) || x.elapsedYears <= 0)
    simpleError("elapsedYears", "Provide a finite positive number.");
  const growthMetersPerYear =
    (x.endingHeightMeters - x.startingHeightMeters) / x.elapsedYears;
  if (!Number.isFinite(growthMetersPerYear))
    simpleError(
      "growthMetersPerYear",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    growthMetersPerYear: Object.is(growthMetersPerYear, -0)
      ? 0
      : growthMetersPerYear,
  };
};

export const example = {
  input: {
    startingHeightMeters: 10,
    endingHeightMeters: 12,
    elapsedYears: 2,
  },
  output: { growthMetersPerYear: 1 },
} satisfies ToolExample<HeightGrowthAnnualInput, HeightGrowthAnnualOutput>;

export const tool = createSimpleTool({
  id: "forestry/height-growth-annual",
  title: "Height Growth Annual",
  description: "Average annual tree-height change between two measurements.",
  inputs: [
    {
      id: "startingHeightMeters",
      kind: "number",
      label: "Starting Height Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "endingHeightMeters",
      kind: "number",
      label: "Ending Height Meters",
      unit: "m",
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
      id: "growthMetersPerYear",
      kind: "number",
      label: "Growth Meters Per Year",
      unit: "m/year",
    },
  ],
  calculate: (input) =>
    calculateHeightGrowthAnnual({
      startingHeightMeters: input.startingHeightMeters as number,
      endingHeightMeters: input.endingHeightMeters as number,
      elapsedYears: input.elapsedYears as number,
    }),
});
export const heightGrowthAnnualTool = tool;
export const runHeightGrowthAnnual = tool.execute;
export default tool;
