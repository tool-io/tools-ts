import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KurzweilAccelerationInput = {
  readonly milestoneValues: ReadonlyArray<number>;
  readonly milestoneYears: ReadonlyArray<number>;
};

export type KurzweilAccelerationOutput = {
  readonly accelerating: boolean;
  readonly annualizedGrowthDifferencePercent: number;
  readonly earlyAnnualizedGrowthPercent: number;
  readonly lateAnnualizedGrowthPercent: number;
};

const average = (values: ReadonlyArray<number>): number =>
  values.reduce((total, value) => total + value, 0) / values.length;

export const classifyKurzweilAcceleratingReturns = (
  input: KurzweilAccelerationInput,
): KurzweilAccelerationOutput => {
  if (
    !Array.isArray(input.milestoneYears) ||
    !Array.isArray(input.milestoneValues) ||
    input.milestoneYears.length !== input.milestoneValues.length ||
    input.milestoneYears.length < 2
  )
    simpleError(
      "milestoneValues",
      "At least two matching milestone years and values are required.",
      "milestone_series_length_mismatch",
    );
  for (const [index, year] of input.milestoneYears.entries())
    if (
      !Number.isFinite(year) ||
      (index > 0 && year <= input.milestoneYears[index - 1]!)
    )
      simpleError(
        `milestoneYears.${index}`,
        "Milestone years must be finite and strictly increasing.",
        "invalid_milestone_year",
      );
  for (const [index, value] of input.milestoneValues.entries())
    if (!Number.isFinite(value) || value <= 0)
      simpleError(
        `milestoneValues.${index}`,
        "Milestone values must be finite and greater than zero.",
        "invalid_milestone_value",
      );
  const segmentGrowthRates = input.milestoneValues
    .slice(0, -1)
    .map((value, index) => {
      const elapsedYears =
        input.milestoneYears[index + 1]! - input.milestoneYears[index]!;
      return (
        (Math.log(input.milestoneValues[index + 1]! / value) / elapsedYears) *
        100
      );
    });
  const midpoint = Math.ceil(segmentGrowthRates.length / 2);
  const earlyAnnualizedGrowthPercent = average(
    segmentGrowthRates.slice(0, midpoint),
  );
  const lateAnnualizedGrowthPercent = average(
    segmentGrowthRates.slice(midpoint),
  );
  const annualizedGrowthDifferencePercent =
    lateAnnualizedGrowthPercent - earlyAnnualizedGrowthPercent;
  if (!Number.isFinite(annualizedGrowthDifferencePercent))
    simpleError(
      "",
      "The acceleration comparison is not finite.",
      "result_not_finite",
    );
  return {
    accelerating: annualizedGrowthDifferencePercent > 0,
    annualizedGrowthDifferencePercent,
    earlyAnnualizedGrowthPercent,
    lateAnnualizedGrowthPercent,
  };
};

export const kurzweilAccelerationExample = {
  input: {
    milestoneValues: [10, 20, 60, 240],
    milestoneYears: [2000, 2005, 2010, 2015],
  },
  output: {
    accelerating: true,
    annualizedGrowthDifferencePercent: 9.80829253011726,
    earlyAnnualizedGrowthPercent: 17.91759469228055,
    lateAnnualizedGrowthPercent: 27.72588722239781,
  },
} satisfies ToolExample<KurzweilAccelerationInput, KurzweilAccelerationOutput>;

export const kurzweilAccelerationTool = createSimpleTool({
  calculate: (input) =>
    classifyKurzweilAcceleratingReturns({
      milestoneValues: input.milestoneValues as number[],
      milestoneYears: input.milestoneYears as number[],
    }),
  description:
    "Compare early and late annualized log growth across a caller-supplied milestone series to test for accelerating returns.",
  id: "futurology/kurzweil-law-accelerating-returns-lookup",
  inputs: [
    {
      description: "At least two positive values in chronological order.",
      id: "milestoneValues",
      kind: "numberList",
      label: "Milestone values",
    },
    {
      description: "At least two strictly increasing years.",
      id: "milestoneYears",
      kind: "numberList",
      label: "Milestone years",
    },
  ],
  outputs: [
    { id: "accelerating", kind: "boolean", label: "Growth accelerating" },
    {
      id: "annualizedGrowthDifferencePercent",
      kind: "number",
      label: "Late minus early annualized growth",
      unit: "%",
    },
    {
      id: "earlyAnnualizedGrowthPercent",
      kind: "number",
      label: "Early annualized growth percent",
      unit: "%",
    },
    {
      id: "lateAnnualizedGrowthPercent",
      kind: "number",
      label: "Late annualized growth percent",
      unit: "%",
    },
  ],
  title: "Kurzweil Law Accelerating Returns Lookup",
});

export const runKurzweilAcceleration = kurzweilAccelerationTool.execute;
export default kurzweilAccelerationTool;
