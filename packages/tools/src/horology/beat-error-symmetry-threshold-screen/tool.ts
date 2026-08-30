import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BeatErrorSymmetryInput = {
  readonly firstBeatErrorMilliseconds: number;
  readonly maximumAllowedBeatErrorMilliseconds: number;
  readonly maximumAllowedRelativeDifferencePercent: number;
  readonly secondBeatErrorMilliseconds: number;
};

export type BeatErrorSymmetryOutput = {
  readonly absoluteDifferenceMilliseconds: number;
  readonly largerBeatErrorMilliseconds: number;
  readonly relativeDifferencePercent: number;
  readonly withinCallerThresholds: boolean;
};

export const screenBeatErrorSymmetry = (
  input: BeatErrorSymmetryInput,
): BeatErrorSymmetryOutput => {
  if (
    !Number.isFinite(input.firstBeatErrorMilliseconds) ||
    input.firstBeatErrorMilliseconds < 0
  )
    simpleError(
      "firstBeatErrorMilliseconds",
      "First beat error must be finite and nonnegative.",
      "first_beat_error_invalid",
    );
  if (
    !Number.isFinite(input.secondBeatErrorMilliseconds) ||
    input.secondBeatErrorMilliseconds < 0
  )
    simpleError(
      "secondBeatErrorMilliseconds",
      "Second beat error must be finite and nonnegative.",
      "second_beat_error_invalid",
    );
  if (
    !Number.isFinite(input.maximumAllowedBeatErrorMilliseconds) ||
    input.maximumAllowedBeatErrorMilliseconds <= 0
  )
    simpleError(
      "maximumAllowedBeatErrorMilliseconds",
      "Beat-error limit must be finite and positive.",
      "beat_error_limit_invalid",
    );
  if (
    !Number.isFinite(input.maximumAllowedRelativeDifferencePercent) ||
    input.maximumAllowedRelativeDifferencePercent < 0
  )
    simpleError(
      "maximumAllowedRelativeDifferencePercent",
      "Relative-difference limit must be finite and nonnegative.",
      "relative_difference_limit_invalid",
    );
  const largerBeatErrorMilliseconds = Math.max(
    input.firstBeatErrorMilliseconds,
    input.secondBeatErrorMilliseconds,
  );
  const absoluteDifferenceMilliseconds = Math.abs(
    input.firstBeatErrorMilliseconds - input.secondBeatErrorMilliseconds,
  );
  const relativeDifferencePercent =
    largerBeatErrorMilliseconds === 0
      ? 0
      : (100 * absoluteDifferenceMilliseconds) / largerBeatErrorMilliseconds;
  return {
    absoluteDifferenceMilliseconds,
    largerBeatErrorMilliseconds,
    relativeDifferencePercent,
    withinCallerThresholds:
      largerBeatErrorMilliseconds <=
        input.maximumAllowedBeatErrorMilliseconds &&
      relativeDifferencePercent <=
        input.maximumAllowedRelativeDifferencePercent,
  };
};

export const beatErrorSymmetryExample = {
  input: {
    firstBeatErrorMilliseconds: 0.4,
    maximumAllowedBeatErrorMilliseconds: 0.8,
    maximumAllowedRelativeDifferencePercent: 25,
    secondBeatErrorMilliseconds: 0.6,
  },
  output: {
    absoluteDifferenceMilliseconds: 0.19999999999999996,
    largerBeatErrorMilliseconds: 0.6,
    relativeDifferencePercent: 33.33333333333333,
    withinCallerThresholds: false,
  },
} satisfies ToolExample<BeatErrorSymmetryInput, BeatErrorSymmetryOutput>;

export const beatErrorSymmetryTool = createSimpleTool({
  calculate: (input) =>
    screenBeatErrorSymmetry({
      firstBeatErrorMilliseconds: input.firstBeatErrorMilliseconds as number,
      maximumAllowedBeatErrorMilliseconds:
        input.maximumAllowedBeatErrorMilliseconds as number,
      maximumAllowedRelativeDifferencePercent:
        input.maximumAllowedRelativeDifferencePercent as number,
      secondBeatErrorMilliseconds: input.secondBeatErrorMilliseconds as number,
    }),
  description:
    "Screen two beat-error observations against explicit caller-supplied magnitude and relative-difference limits; this is not a certification decision.",
  id: "horology/beat-error-symmetry-threshold-screen",
  inputs: [
    {
      id: "firstBeatErrorMilliseconds",
      kind: "number",
      label: "First beat-error observation",
      minimum: 0,
      unit: "ms",
    },
    {
      id: "maximumAllowedBeatErrorMilliseconds",
      kind: "number",
      label: "Maximum allowed beat error",
      minimum: 0,
      unit: "ms",
    },
    {
      id: "maximumAllowedRelativeDifferencePercent",
      kind: "number",
      label: "Maximum allowed relative difference",
      minimum: 0,
      unit: "%",
    },
    {
      id: "secondBeatErrorMilliseconds",
      kind: "number",
      label: "Second beat-error observation",
      minimum: 0,
      unit: "ms",
    },
  ],
  outputs: [
    {
      id: "absoluteDifferenceMilliseconds",
      kind: "number",
      label: "Absolute difference",
      minimum: 0,
      unit: "ms",
    },
    {
      id: "largerBeatErrorMilliseconds",
      kind: "number",
      label: "Larger beat-error observation",
      minimum: 0,
      unit: "ms",
    },
    {
      id: "relativeDifferencePercent",
      kind: "number",
      label: "Relative difference",
      minimum: 0,
      unit: "%",
    },
    {
      id: "withinCallerThresholds",
      kind: "boolean",
      label: "Within caller thresholds",
    },
  ],
  title: "Beat Error Symmetry Threshold Screen",
});

export const runBeatErrorSymmetry = beatErrorSymmetryTool.execute;
export default beatErrorSymmetryTool;
