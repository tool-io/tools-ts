import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ContinuousCustomsBondMinimumLookupInput = {
  readonly bondMultiplierPercent?: number;
  readonly priorTwelveMonthChargesUsd: number;
  readonly statutoryMinimumUsd?: number;
};

export type ContinuousCustomsBondMinimumLookupOutput = {
  readonly computedBondAmount: number;
  readonly minimumApplies: boolean;
  readonly requiredBondAmount: number;
};

export const calculateContinuousCustomsBondMinimumLookup = (
  input: ContinuousCustomsBondMinimumLookupInput,
): ContinuousCustomsBondMinimumLookupOutput => {
  const bondMultiplierPercent = input.bondMultiplierPercent ?? 10;
  const statutoryMinimumUsd = input.statutoryMinimumUsd ?? 50000;
  if (
    !Number.isFinite(bondMultiplierPercent) ||
    bondMultiplierPercent <= 0 ||
    bondMultiplierPercent > 100
  )
    return simpleError(
      "bondMultiplierPercent",
      "Bond multiplier must be finite, greater than zero, and at most one hundred percent.",
      "invalid_percent",
    );
  if (
    !Number.isFinite(input.priorTwelveMonthChargesUsd) ||
    input.priorTwelveMonthChargesUsd < 0
  )
    return simpleError(
      "priorTwelveMonthChargesUsd",
      "Trailing charges must be finite and non-negative.",
      "invalid_charges",
    );
  if (!Number.isFinite(statutoryMinimumUsd) || statutoryMinimumUsd < 0)
    return simpleError(
      "statutoryMinimumUsd",
      "The minimum bond must be finite and non-negative.",
      "invalid_minimum",
    );
  const computedBondAmount =
    input.priorTwelveMonthChargesUsd * (bondMultiplierPercent / 100);
  const roundingIncrementUsd =
    input.priorTwelveMonthChargesUsd > 1_000_000 ? 100_000 : 10_000;
  const roundedBondAmount =
    Math.round(computedBondAmount / roundingIncrementUsd) *
    roundingIncrementUsd;
  const requiredBondAmount = Math.max(statutoryMinimumUsd, roundedBondAmount);
  if (
    !Number.isFinite(computedBondAmount) ||
    (input.priorTwelveMonthChargesUsd > 0 && computedBondAmount <= 0) ||
    !Number.isFinite(requiredBondAmount)
  )
    return simpleError(
      "priorTwelveMonthChargesUsd",
      "The bond amount is outside the representable range.",
      "bond_out_of_range",
    );
  return {
    computedBondAmount,
    minimumApplies: roundedBondAmount < statutoryMinimumUsd,
    requiredBondAmount,
  };
};

export const continuousCustomsBondMinimumLookupExample = {
  input: {
    bondMultiplierPercent: 10,
    priorTwelveMonthChargesUsd: 420000,
    statutoryMinimumUsd: 50000,
  },
  output: {
    computedBondAmount: 42000,
    minimumApplies: true,
    requiredBondAmount: 50000,
  },
} satisfies ToolExample<
  ContinuousCustomsBondMinimumLookupInput,
  ContinuousCustomsBondMinimumLookupOutput
>;

export const continuousCustomsBondMinimumLookupTool = createSimpleTool({
  id: "logistics/continuous-customs-bond-minimum-lookup",
  title: "Continuous Customs Bond Minimum Lookup",
  description:
    "Estimate a US continuous Activity Code 1 customs bond from trailing duties, taxes, and fees, applying the standard 10% formula, CBP rounding increments, and the $50,000 planning minimum. CBP may require a different amount.",
  inputs: [
    {
      default: 10,
      description:
        "Bond multiplier percent of trailing charges; standard is 10.",
      id: "bondMultiplierPercent",
      kind: "number",
      label: "Multiplier percent",
      maximum: 100,
      minimum: Number.MIN_VALUE,
      unit: "%",
    },
    {
      description:
        "Duties, taxes and fees paid in the prior twelve months in USD.",
      id: "priorTwelveMonthChargesUsd",
      kind: "number",
      label: "Trailing charges",
      minimum: 0,
      unit: "USD",
    },
    {
      default: 50000,
      description: "Statutory minimum bond amount in USD.",
      id: "statutoryMinimumUsd",
      kind: "number",
      label: "Statutory minimum",
      minimum: 0,
      unit: "USD",
    },
  ],
  outputs: [
    {
      description: "Multiplier applied to trailing charges in USD.",
      id: "computedBondAmount",
      kind: "number",
      label: "Computed bond",
      minimum: 0,
      unit: "USD",
    },
    {
      description: "True when the statutory minimum exceeds the computed bond.",
      id: "minimumApplies",
      kind: "boolean",
      label: "Minimum applies",
    },
    {
      description: "Required continuous bond amount in USD.",
      id: "requiredBondAmount",
      kind: "number",
      label: "Required bond",
      minimum: 0,
      unit: "USD",
    },
  ],
  calculate: (input) =>
    calculateContinuousCustomsBondMinimumLookup({
      bondMultiplierPercent: input.bondMultiplierPercent as number | undefined,
      priorTwelveMonthChargesUsd: input.priorTwelveMonthChargesUsd as number,
      statutoryMinimumUsd: input.statutoryMinimumUsd as number | undefined,
    }),
});

export const runContinuousCustomsBondMinimumLookup =
  continuousCustomsBondMinimumLookupTool.execute;
export default continuousCustomsBondMinimumLookupTool;
