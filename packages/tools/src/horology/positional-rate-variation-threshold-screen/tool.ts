import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PositionalRateVariationInput = {
  readonly maximumAllowedRangeSecondsPerDay: number;
  readonly positionRatesSecondsPerDay: readonly number[];
};

export type PositionalRateVariationOutput = {
  readonly arithmeticMeanSecondsPerDay: number;
  readonly maximumRateSecondsPerDay: number;
  readonly minimumRateSecondsPerDay: number;
  readonly positionCount: number;
  readonly rangeSecondsPerDay: number;
  readonly withinCallerRangeLimit: boolean;
};

export const screenPositionalRateVariation = (
  input: PositionalRateVariationInput,
): PositionalRateVariationOutput => {
  if (input.positionRatesSecondsPerDay.length < 2)
    simpleError(
      "positionRatesSecondsPerDay",
      "At least two position rates are required.",
      "insufficient_position_rates",
    );
  if (
    !Number.isFinite(input.maximumAllowedRangeSecondsPerDay) ||
    input.maximumAllowedRangeSecondsPerDay < 0
  )
    simpleError(
      "maximumAllowedRangeSecondsPerDay",
      "Range limit must be finite and nonnegative.",
      "range_limit_invalid",
    );
  const minimumRateSecondsPerDay = Math.min(
    ...input.positionRatesSecondsPerDay,
  );
  const maximumRateSecondsPerDay = Math.max(
    ...input.positionRatesSecondsPerDay,
  );
  const rangeSecondsPerDay =
    maximumRateSecondsPerDay - minimumRateSecondsPerDay;
  return {
    arithmeticMeanSecondsPerDay:
      input.positionRatesSecondsPerDay.reduce((sum, rate) => sum + rate, 0) /
      input.positionRatesSecondsPerDay.length,
    maximumRateSecondsPerDay,
    minimumRateSecondsPerDay,
    positionCount: input.positionRatesSecondsPerDay.length,
    rangeSecondsPerDay,
    withinCallerRangeLimit:
      rangeSecondsPerDay <= input.maximumAllowedRangeSecondsPerDay,
  };
};

export const positionalRateVariationExample = {
  input: {
    maximumAllowedRangeSecondsPerDay: 6,
    positionRatesSecondsPerDay: [-2, 1, 3, 0],
  },
  output: {
    arithmeticMeanSecondsPerDay: 0.5,
    maximumRateSecondsPerDay: 3,
    minimumRateSecondsPerDay: -2,
    positionCount: 4,
    rangeSecondsPerDay: 5,
    withinCallerRangeLimit: true,
  },
} satisfies ToolExample<
  PositionalRateVariationInput,
  PositionalRateVariationOutput
>;

export const positionalRateVariationTool = createSimpleTool({
  calculate: (input) =>
    screenPositionalRateVariation({
      maximumAllowedRangeSecondsPerDay:
        input.maximumAllowedRangeSecondsPerDay as number,
      positionRatesSecondsPerDay: input.positionRatesSecondsPerDay as number[],
    }),
  description:
    "Calculate the maximum-minus-minimum rate spread across measured positions and compare it only with an explicit caller-supplied range limit.",
  id: "horology/positional-rate-variation-threshold-screen",
  inputs: [
    {
      id: "maximumAllowedRangeSecondsPerDay",
      kind: "number",
      label: "Maximum allowed positional rate range",
      minimum: 0,
      unit: "s/day",
    },
    {
      id: "positionRatesSecondsPerDay",
      kind: "numberList",
      label: "Measured position rates",
      unit: "s/day",
    },
  ],
  outputs: [
    {
      id: "arithmeticMeanSecondsPerDay",
      kind: "number",
      label: "Arithmetic mean position rate",
      unit: "s/day",
    },
    {
      id: "maximumRateSecondsPerDay",
      kind: "number",
      label: "Maximum position rate",
      unit: "s/day",
    },
    {
      id: "minimumRateSecondsPerDay",
      kind: "number",
      label: "Minimum position rate",
      unit: "s/day",
    },
    {
      id: "positionCount",
      kind: "integer",
      label: "Position count",
      minimum: 2,
    },
    {
      id: "rangeSecondsPerDay",
      kind: "number",
      label: "Maximum-minus-minimum rate range",
      minimum: 0,
      unit: "s/day",
    },
    {
      id: "withinCallerRangeLimit",
      kind: "boolean",
      label: "Within caller range limit",
    },
  ],
  title: "Positional Rate Variation Threshold Screen",
});

export const runPositionalRateVariation = positionalRateVariationTool.execute;
export default positionalRateVariationTool;
