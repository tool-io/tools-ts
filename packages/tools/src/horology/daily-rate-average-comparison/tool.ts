import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DailyRateInterval = readonly [
  durationHours: number,
  rateSecondsPerDay: number,
];

export type DailyRateMeanInput = {
  readonly intervals: readonly (readonly number[])[];
};

export type DailyRateMeanOutput = {
  readonly arithmeticMeanSecondsPerDay: number;
  readonly durationWeightedMeanSecondsPerDay: number;
  readonly meanDifferenceSecondsPerDay: number;
  readonly totalDurationHours: number;
};

export const calculateDailyRateMeans = (
  input: DailyRateMeanInput,
): DailyRateMeanOutput => {
  if (input.intervals.length < 1)
    simpleError(
      "intervals",
      "At least one rate interval is required.",
      "insufficient_intervals",
    );
  if (input.intervals.some((row) => row.length !== 2))
    simpleError(
      "intervals",
      "Each interval must contain duration and daily rate.",
      "invalid_interval_shape",
    );
  for (const [durationHours, rateSecondsPerDay] of input.intervals)
    if (!Number.isFinite(durationHours) || durationHours <= 0)
      simpleError(
        "intervals",
        "Interval durations must be finite and positive.",
        "invalid_interval_duration",
      );
    else if (!Number.isFinite(rateSecondsPerDay))
      simpleError(
        "intervals",
        "All daily rates must be finite.",
        "invalid_interval_rate",
      );
  const totalDurationHours = input.intervals.reduce(
    (sum, [durationHours]) => sum + durationHours,
    0,
  );
  const arithmeticMeanSecondsPerDay =
    input.intervals.reduce(
      (sum, [, rateSecondsPerDay]) => sum + rateSecondsPerDay,
      0,
    ) / input.intervals.length;
  const durationWeightedMeanSecondsPerDay =
    input.intervals.reduce(
      (sum, [durationHours, rateSecondsPerDay]) =>
        sum + durationHours * rateSecondsPerDay,
      0,
    ) / totalDurationHours;
  return {
    arithmeticMeanSecondsPerDay,
    durationWeightedMeanSecondsPerDay,
    meanDifferenceSecondsPerDay:
      durationWeightedMeanSecondsPerDay - arithmeticMeanSecondsPerDay,
    totalDurationHours,
  };
};

export const dailyRateMeanExample = {
  input: {
    intervals: [
      [10, 1],
      [30, 5],
      [60, 0],
    ],
  },
  output: {
    arithmeticMeanSecondsPerDay: 2,
    durationWeightedMeanSecondsPerDay: 1.6,
    meanDifferenceSecondsPerDay: -0.3999999999999999,
    totalDurationHours: 100,
  },
} satisfies ToolExample<DailyRateMeanInput, DailyRateMeanOutput>;

export const dailyRateMeanTool = createSimpleTool({
  calculate: (input) =>
    calculateDailyRateMeans({ intervals: input.intervals as number[][] }),
  description:
    "Compare an unweighted arithmetic mean of daily rates with a duration-weighted mean for explicitly supplied measurement intervals.",
  id: "horology/daily-rate-average-comparison",
  inputs: [
    {
      description: "Rows contain [duration in hours, rate in seconds per day].",
      id: "intervals",
      kind: "matrix",
      label: "Daily-rate intervals",
    },
  ],
  outputs: [
    {
      id: "arithmeticMeanSecondsPerDay",
      kind: "number",
      label: "Arithmetic mean daily rate",
      unit: "s/day",
    },
    {
      id: "durationWeightedMeanSecondsPerDay",
      kind: "number",
      label: "Duration-weighted mean daily rate",
      unit: "s/day",
    },
    {
      id: "meanDifferenceSecondsPerDay",
      kind: "number",
      label: "Weighted minus arithmetic mean",
      unit: "s/day",
    },
    {
      id: "totalDurationHours",
      kind: "number",
      label: "Total represented duration",
      minimum: 0,
      unit: "h",
    },
  ],
  title: "Daily Rate Average Comparison",
});

export const runDailyRateMean = dailyRateMeanTool.execute;
export default dailyRateMeanTool;
