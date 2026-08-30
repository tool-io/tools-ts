import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DiameterGrowthAnnualInput = Readonly<{
  readonly startingDbhCentimeters: number;
  readonly endingDbhCentimeters: number;
  readonly elapsedYears: number;
}>;
export type DiameterGrowthAnnualOutput = Readonly<{
  readonly growthCentimetersPerYear: number;
}>;

export const calculateDiameterGrowthAnnual = (
  x: DiameterGrowthAnnualInput,
): DiameterGrowthAnnualOutput => {
  if (
    !Number.isFinite(x.startingDbhCentimeters) ||
    x.startingDbhCentimeters < 0
  )
    simpleError(
      "startingDbhCentimeters",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.endingDbhCentimeters) || x.endingDbhCentimeters < 0)
    simpleError("endingDbhCentimeters", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.elapsedYears) || x.elapsedYears <= 0)
    simpleError("elapsedYears", "Provide a finite positive number.");
  const growthCentimetersPerYear =
    (x.endingDbhCentimeters - x.startingDbhCentimeters) / x.elapsedYears;
  if (!Number.isFinite(growthCentimetersPerYear))
    simpleError(
      "growthCentimetersPerYear",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    growthCentimetersPerYear: Object.is(growthCentimetersPerYear, -0)
      ? 0
      : growthCentimetersPerYear,
  };
};

export const example = {
  input: {
    startingDbhCentimeters: 20,
    endingDbhCentimeters: 22,
    elapsedYears: 2,
  },
  output: { growthCentimetersPerYear: 1 },
} satisfies ToolExample<DiameterGrowthAnnualInput, DiameterGrowthAnnualOutput>;

export const tool = createSimpleTool({
  id: "forestry/diameter-growth-annual",
  title: "Diameter Growth Annual",
  description:
    "Average annual DBH change in centimetres between two measurements.",
  inputs: [
    {
      id: "startingDbhCentimeters",
      kind: "number",
      label: "Starting Dbh Centimeters",
      unit: "cm",
      minimum: 0,
    },
    {
      id: "endingDbhCentimeters",
      kind: "number",
      label: "Ending Dbh Centimeters",
      unit: "cm",
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
      id: "growthCentimetersPerYear",
      kind: "number",
      label: "Growth Centimeters Per Year",
      unit: "cm/year",
    },
  ],
  calculate: (input) =>
    calculateDiameterGrowthAnnual({
      startingDbhCentimeters: input.startingDbhCentimeters as number,
      endingDbhCentimeters: input.endingDbhCentimeters as number,
      elapsedYears: input.elapsedYears as number,
    }),
});
export const diameterGrowthAnnualTool = tool;
export const runDiameterGrowthAnnual = tool.execute;
export default tool;
