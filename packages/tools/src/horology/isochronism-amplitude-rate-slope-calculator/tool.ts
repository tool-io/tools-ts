import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IsochronismSlopeInput = {
  readonly highAmplitudeDegrees: number;
  readonly highRateSecondsPerDay: number;
  readonly lowAmplitudeDegrees: number;
  readonly lowRateSecondsPerDay: number;
  readonly maximumAllowedAbsoluteRateChangeSecondsPerDay: number;
};

export type IsochronismSlopeOutput = {
  readonly absoluteRateChangeSecondsPerDay: number;
  readonly amplitudeChangeDegrees: number;
  readonly rateChangePerAmplitudeDegree: number;
  readonly withinCallerRateChangeLimit: boolean;
};

export const calculateIsochronismAmplitudeRateSlope = (
  input: IsochronismSlopeInput,
): IsochronismSlopeOutput => {
  if (
    !Number.isFinite(input.lowAmplitudeDegrees) ||
    input.lowAmplitudeDegrees <= 0
  )
    simpleError(
      "lowAmplitudeDegrees",
      "Low amplitude must be finite and positive.",
      "low_amplitude_invalid",
    );
  if (
    !Number.isFinite(input.highAmplitudeDegrees) ||
    input.highAmplitudeDegrees <= input.lowAmplitudeDegrees
  )
    simpleError(
      "highAmplitudeDegrees",
      "High amplitude must be finite and above low amplitude.",
      "high_amplitude_invalid",
    );
  if (
    !Number.isFinite(input.lowRateSecondsPerDay) ||
    !Number.isFinite(input.highRateSecondsPerDay)
  )
    simpleError("", "Both rates must be finite.", "rate_invalid");
  if (
    !Number.isFinite(input.maximumAllowedAbsoluteRateChangeSecondsPerDay) ||
    input.maximumAllowedAbsoluteRateChangeSecondsPerDay < 0
  )
    simpleError(
      "maximumAllowedAbsoluteRateChangeSecondsPerDay",
      "Rate-change limit must be finite and nonnegative.",
      "rate_change_limit_invalid",
    );
  const amplitudeChangeDegrees =
    input.highAmplitudeDegrees - input.lowAmplitudeDegrees;
  const rateChange = input.highRateSecondsPerDay - input.lowRateSecondsPerDay;
  const absoluteRateChangeSecondsPerDay = Math.abs(rateChange);
  return {
    absoluteRateChangeSecondsPerDay,
    amplitudeChangeDegrees,
    rateChangePerAmplitudeDegree: rateChange / amplitudeChangeDegrees,
    withinCallerRateChangeLimit:
      absoluteRateChangeSecondsPerDay <=
      input.maximumAllowedAbsoluteRateChangeSecondsPerDay,
  };
};

export const isochronismSlopeExample = {
  input: {
    highAmplitudeDegrees: 280,
    highRateSecondsPerDay: 4,
    lowAmplitudeDegrees: 200,
    lowRateSecondsPerDay: -2,
    maximumAllowedAbsoluteRateChangeSecondsPerDay: 5,
  },
  output: {
    absoluteRateChangeSecondsPerDay: 6,
    amplitudeChangeDegrees: 80,
    rateChangePerAmplitudeDegree: 0.075,
    withinCallerRateChangeLimit: false,
  },
} satisfies ToolExample<IsochronismSlopeInput, IsochronismSlopeOutput>;

export const isochronismSlopeTool = createSimpleTool({
  calculate: (input) =>
    calculateIsochronismAmplitudeRateSlope({
      highAmplitudeDegrees: input.highAmplitudeDegrees as number,
      highRateSecondsPerDay: input.highRateSecondsPerDay as number,
      lowAmplitudeDegrees: input.lowAmplitudeDegrees as number,
      lowRateSecondsPerDay: input.lowRateSecondsPerDay as number,
      maximumAllowedAbsoluteRateChangeSecondsPerDay:
        input.maximumAllowedAbsoluteRateChangeSecondsPerDay as number,
    }),
  description:
    "Measure the endpoint rate change and slope between two caller-supplied amplitude observations; this does not turn a two-point slope into a complete isochronism curve.",
  id: "horology/isochronism-amplitude-rate-slope-calculator",
  inputs: [
    {
      id: "highAmplitudeDegrees",
      kind: "number",
      label: "High observed amplitude",
      minimum: 0,
      unit: "deg",
    },
    {
      id: "highRateSecondsPerDay",
      kind: "number",
      label: "Rate at high amplitude",
      unit: "s/day",
    },
    {
      id: "lowAmplitudeDegrees",
      kind: "number",
      label: "Low observed amplitude",
      minimum: 0,
      unit: "deg",
    },
    {
      id: "lowRateSecondsPerDay",
      kind: "number",
      label: "Rate at low amplitude",
      unit: "s/day",
    },
    {
      id: "maximumAllowedAbsoluteRateChangeSecondsPerDay",
      kind: "number",
      label: "Maximum allowed absolute endpoint rate change",
      minimum: 0,
      unit: "s/day",
    },
  ],
  outputs: [
    {
      id: "absoluteRateChangeSecondsPerDay",
      kind: "number",
      label: "Absolute endpoint rate change",
      minimum: 0,
      unit: "s/day",
    },
    {
      id: "amplitudeChangeDegrees",
      kind: "number",
      label: "Amplitude change",
      minimum: 0,
      unit: "deg",
    },
    {
      id: "rateChangePerAmplitudeDegree",
      kind: "number",
      label: "Rate change per amplitude degree",
      unit: "s/day/deg",
    },
    {
      id: "withinCallerRateChangeLimit",
      kind: "boolean",
      label: "Within caller endpoint rate-change limit",
    },
  ],
  title: "Isochronism Amplitude Rate Slope Calculator",
});

export const runIsochronismSlope = isochronismSlopeTool.execute;
export default isochronismSlopeTool;
