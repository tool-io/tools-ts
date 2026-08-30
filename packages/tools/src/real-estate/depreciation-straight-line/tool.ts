import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DepreciationStraightLineInput = Readonly<{
  readonly improvementCost: number;
  readonly salvageValue: number;
  readonly usefulLifeYears: number;
}>;
export type DepreciationStraightLineOutput = Readonly<{
  readonly annualDepreciation: number;
}>;

export const calculateDepreciationStraightLine = (
  x: DepreciationStraightLineInput,
): DepreciationStraightLineOutput => {
  if (!Number.isFinite(x.improvementCost) || x.improvementCost < 0)
    simpleError("improvementCost", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.salvageValue) || x.salvageValue < 0)
    simpleError("salvageValue", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.usefulLifeYears) || x.usefulLifeYears <= 0)
    simpleError("usefulLifeYears", "Provide a finite positive number.");
  if (!(x.salvageValue <= x.improvementCost))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const annualDepreciation =
    (x.improvementCost - x.salvageValue) / x.usefulLifeYears;
  if (!Number.isFinite(annualDepreciation))
    simpleError(
      "annualDepreciation",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    annualDepreciation: Object.is(annualDepreciation, -0)
      ? 0
      : annualDepreciation,
  };
};

export const example = {
  input: {
    improvementCost: 100000,
    salvageValue: 10000,
    usefulLifeYears: 30,
  },
  output: { annualDepreciation: 3000 },
} satisfies ToolExample<
  DepreciationStraightLineInput,
  DepreciationStraightLineOutput
>;

export const tool = createSimpleTool({
  id: "real-estate/depreciation-straight-line",
  title: "Depreciation Straight Line",
  description:
    "Annual straight-line depreciation of improvements over useful life; excludes land value.",
  inputs: [
    {
      id: "improvementCost",
      kind: "number",
      label: "Improvement Cost",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "salvageValue",
      kind: "number",
      label: "Salvage Value",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "usefulLifeYears",
      kind: "number",
      label: "Useful Life Years",
      unit: "year",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "annualDepreciation",
      kind: "number",
      label: "Annual Depreciation",
      unit: "currency/year",
    },
  ],
  calculate: (input) =>
    calculateDepreciationStraightLine({
      improvementCost: input.improvementCost as number,
      salvageValue: input.salvageValue as number,
      usefulLifeYears: input.usefulLifeYears as number,
    }),
});
export const depreciationStraightLineTool = tool;
export const runDepreciationStraightLine = tool.execute;
export default tool;
