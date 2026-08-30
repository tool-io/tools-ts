import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AmplitudeRateObservation = readonly [
  amplitudeDegrees: number,
  rateSecondsPerDay: number,
];

export type AmplitudeRateInterpolationInput = {
  readonly observations: readonly (readonly number[])[];
  readonly targetAmplitudeDegrees: number;
};

export type AmplitudeRateInterpolationOutput = {
  readonly bracketingAmplitudesDegrees: readonly number[];
  readonly maximumObservedRateSecondsPerDay: number;
  readonly minimumObservedRateSecondsPerDay: number;
  readonly observedAmplitudeRangeDegrees: readonly number[];
  readonly observationCount: number;
  readonly targetRateSecondsPerDay: number;
};

export const calculateAmplitudeDependentRate = (
  input: AmplitudeRateInterpolationInput,
): AmplitudeRateInterpolationOutput => {
  if (input.observations.length < 2)
    simpleError(
      "observations",
      "At least two amplitude-rate observations are required.",
      "insufficient_observations",
    );
  if (input.observations.some((row) => row.length !== 2))
    simpleError(
      "observations",
      "Each observation must contain amplitude and rate.",
      "invalid_observation_shape",
    );
  if (!Number.isFinite(input.targetAmplitudeDegrees))
    simpleError(
      "targetAmplitudeDegrees",
      "Target amplitude must be finite.",
      "target_amplitude_invalid",
    );
  const observations = input.observations
    .map(([amplitudeDegrees, rateSecondsPerDay]) => ({
      amplitudeDegrees,
      rateSecondsPerDay,
    }))
    .sort((left, right) => left.amplitudeDegrees - right.amplitudeDegrees);
  for (const observation of observations)
    if (
      !Number.isFinite(observation.amplitudeDegrees) ||
      observation.amplitudeDegrees <= 0 ||
      !Number.isFinite(observation.rateSecondsPerDay)
    )
      simpleError(
        "observations",
        "Amplitudes must be positive and all values finite.",
        "invalid_observation",
      );
  if (
    new Set(observations.map(({ amplitudeDegrees }) => amplitudeDegrees))
      .size !== observations.length
  )
    simpleError(
      "observations",
      "Observation amplitudes must be unique.",
      "duplicate_amplitude",
    );
  const first =
    observations[0] ??
    simpleError(
      "observations",
      "At least two amplitude-rate observations are required.",
      "insufficient_observations",
    );
  const last =
    observations[observations.length - 1] ??
    simpleError(
      "observations",
      "At least two amplitude-rate observations are required.",
      "insufficient_observations",
    );
  if (
    input.targetAmplitudeDegrees < first.amplitudeDegrees ||
    input.targetAmplitudeDegrees > last.amplitudeDegrees
  )
    simpleError(
      "targetAmplitudeDegrees",
      "Target amplitude is outside the observed range; extrapolation is not performed.",
      "target_outside_observations",
    );
  let lower = first;
  let upper = last;
  for (let index = 1; index < observations.length; index += 1) {
    const lowerCandidate = observations[index - 1];
    const upperCandidate = observations[index];
    if (
      lowerCandidate !== undefined &&
      upperCandidate !== undefined &&
      input.targetAmplitudeDegrees <= upperCandidate.amplitudeDegrees
    ) {
      lower = lowerCandidate;
      upper = upperCandidate;
      break;
    }
  }
  const fraction =
    (input.targetAmplitudeDegrees - lower.amplitudeDegrees) /
    (upper.amplitudeDegrees - lower.amplitudeDegrees);
  return {
    bracketingAmplitudesDegrees: [
      lower.amplitudeDegrees,
      upper.amplitudeDegrees,
    ],
    maximumObservedRateSecondsPerDay: Math.max(
      ...observations.map(({ rateSecondsPerDay }) => rateSecondsPerDay),
    ),
    minimumObservedRateSecondsPerDay: Math.min(
      ...observations.map(({ rateSecondsPerDay }) => rateSecondsPerDay),
    ),
    observedAmplitudeRangeDegrees: [
      first.amplitudeDegrees,
      last.amplitudeDegrees,
    ],
    observationCount: observations.length,
    targetRateSecondsPerDay:
      lower.rateSecondsPerDay +
      fraction * (upper.rateSecondsPerDay - lower.rateSecondsPerDay),
  };
};

export const amplitudeDependentRateExample = {
  input: {
    observations: [
      [200, 0],
      [240, 4],
      [280, 12],
    ],
    targetAmplitudeDegrees: 250,
  },
  output: {
    bracketingAmplitudesDegrees: [240, 280],
    maximumObservedRateSecondsPerDay: 12,
    minimumObservedRateSecondsPerDay: 0,
    observedAmplitudeRangeDegrees: [200, 280],
    observationCount: 3,
    targetRateSecondsPerDay: 6,
  },
} satisfies ToolExample<
  AmplitudeRateInterpolationInput,
  AmplitudeRateInterpolationOutput
>;

export const amplitudeDependentRateTool = createSimpleTool({
  calculate: (input) =>
    calculateAmplitudeDependentRate({
      observations: input.observations as number[][],
      targetAmplitudeDegrees: input.targetAmplitudeDegrees as number,
    }),
  description:
    "Linearly interpolate measured daily rate versus balance amplitude without extrapolating outside caller-supplied observations.",
  id: "horology/amplitude-rate-interpolator",
  inputs: [
    {
      description:
        "Rows contain [amplitude in degrees, rate in seconds per day].",
      id: "observations",
      kind: "matrix",
      label: "Amplitude-rate observations",
    },
    {
      id: "targetAmplitudeDegrees",
      kind: "number",
      label: "Target amplitude",
      minimum: 0,
      unit: "deg",
    },
  ],
  outputs: [
    {
      id: "bracketingAmplitudesDegrees",
      kind: "numberList",
      label: "Bracketing amplitudes",
      unit: "deg",
    },
    {
      id: "maximumObservedRateSecondsPerDay",
      kind: "number",
      label: "Maximum observed rate",
      unit: "s/day",
    },
    {
      id: "minimumObservedRateSecondsPerDay",
      kind: "number",
      label: "Minimum observed rate",
      unit: "s/day",
    },
    {
      id: "observedAmplitudeRangeDegrees",
      kind: "numberList",
      label: "Observed amplitude range",
      unit: "deg",
    },
    {
      id: "observationCount",
      kind: "integer",
      label: "Observation count",
      minimum: 2,
    },
    {
      id: "targetRateSecondsPerDay",
      kind: "number",
      label: "Interpolated rate",
      unit: "s/day",
    },
  ],
  title: "Amplitude–Rate Interpolator",
});

export const runAmplitudeDependentRate = amplitudeDependentRateTool.execute;
export default amplitudeDependentRateTool;
