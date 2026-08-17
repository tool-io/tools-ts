import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type EffectiveAnnualRateInput = {
  readonly nominalAnnualRatePercent: number;
  readonly periodsPerYear?: number;
};

export type EffectiveAnnualRateOutput = {
  readonly effectiveAnnualRatePercent: number;
};

export const effectiveAnnualRateExample = {
  input: { nominalAnnualRatePercent: 10, periodsPerYear: 2 },
  output: { effectiveAnnualRatePercent: 10.25 },
} satisfies ToolExample<EffectiveAnnualRateInput, EffectiveAnnualRateOutput>;

export const calculateEffectiveAnnualRate = (
  input: EffectiveAnnualRateInput,
): EffectiveAnnualRateOutput => {
  const rate = input.nominalAnnualRatePercent / 100;
  const periods = input.periodsPerYear ?? 1;
  if (periods < 1 || !Number.isInteger(periods))
    simpleError(
      "periodsPerYear",
      "Compounding periods must be a positive integer.",
      "invalid_periods",
    );
  if (rate <= -periods)
    simpleError(
      "nominalAnnualRatePercent",
      "The rate is too negative for this compounding frequency.",
      "invalid_rate",
    );
  const effective = (1 + rate / periods) ** periods - 1;
  return { effectiveAnnualRatePercent: roundStatistic(effective * 100) };
};

export const effectiveAnnualRateTool = createSimpleTool({
  calculate: (input) =>
    calculateEffectiveAnnualRate(input as unknown as EffectiveAnnualRateInput),
  description:
    "Convert a nominal annual rate with periodic compounding into its effective annual rate.",
  id: "finance/effective-annual-rate",
  inputs: [
    {
      description: "Stated annual rate before compounding.",
      id: "nominalAnnualRatePercent",
      kind: "number",
      label: "Nominal annual rate",
      unit: "%",
    },
    {
      default: 1,
      description:
        "Compounding periods per year, for example twelve for monthly.",
      id: "periodsPerYear",
      kind: "integer",
      label: "Periods per year",
      maximum: 365,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Yearly rate including the effect of intra-year compounding.",
      format: "percent",
      id: "effectiveAnnualRatePercent",
      kind: "number",
      label: "Effective annual rate",
      unit: "%",
    },
  ],
  title: "Effective Annual Rate Calculator",
});
export const runEffectiveAnnualRate = effectiveAnnualRateTool.execute;
export default effectiveAnnualRateTool;
