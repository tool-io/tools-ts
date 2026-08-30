import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BeatErrorOrientationInput = {
  readonly horizontalBeatErrorMilliseconds: number;
  readonly maximumAllowedOrientationDifferenceMilliseconds: number;
  readonly verticalBeatErrorMilliseconds: number;
};

export type BeatErrorOrientationOutput = {
  readonly absoluteDifferenceMilliseconds: number;
  readonly diagnosisCaution: string;
  readonly largerBeatErrorMilliseconds: number;
  readonly withinCallerDifferenceLimit: boolean;
};

export const screenBeatErrorOrientationDifference = (
  input: BeatErrorOrientationInput,
): BeatErrorOrientationOutput => {
  if (
    !Number.isFinite(input.horizontalBeatErrorMilliseconds) ||
    input.horizontalBeatErrorMilliseconds < 0
  )
    simpleError(
      "horizontalBeatErrorMilliseconds",
      "Horizontal beat error must be finite and nonnegative.",
      "horizontal_beat_error_invalid",
    );
  if (
    !Number.isFinite(input.verticalBeatErrorMilliseconds) ||
    input.verticalBeatErrorMilliseconds < 0
  )
    simpleError(
      "verticalBeatErrorMilliseconds",
      "Vertical beat error must be finite and nonnegative.",
      "vertical_beat_error_invalid",
    );
  if (
    !Number.isFinite(input.maximumAllowedOrientationDifferenceMilliseconds) ||
    input.maximumAllowedOrientationDifferenceMilliseconds < 0
  )
    simpleError(
      "maximumAllowedOrientationDifferenceMilliseconds",
      "Difference limit must be finite and nonnegative.",
      "difference_limit_invalid",
    );
  const absoluteDifferenceMilliseconds = Math.abs(
    input.horizontalBeatErrorMilliseconds - input.verticalBeatErrorMilliseconds,
  );
  return {
    absoluteDifferenceMilliseconds,
    diagnosisCaution:
      "A horizontal-versus-vertical beat-error difference can be a symptom, but it does not by itself diagnose poise, regulator alignment, pivots, or escapement geometry.",
    largerBeatErrorMilliseconds: Math.max(
      input.horizontalBeatErrorMilliseconds,
      input.verticalBeatErrorMilliseconds,
    ),
    withinCallerDifferenceLimit:
      absoluteDifferenceMilliseconds <=
      input.maximumAllowedOrientationDifferenceMilliseconds,
  };
};

export const beatErrorOrientationExample = {
  input: {
    horizontalBeatErrorMilliseconds: 0.2,
    maximumAllowedOrientationDifferenceMilliseconds: 0.3,
    verticalBeatErrorMilliseconds: 0.5,
  },
  output: {
    absoluteDifferenceMilliseconds: 0.3,
    diagnosisCaution:
      "A horizontal-versus-vertical beat-error difference can be a symptom, but it does not by itself diagnose poise, regulator alignment, pivots, or escapement geometry.",
    largerBeatErrorMilliseconds: 0.5,
    withinCallerDifferenceLimit: true,
  },
} satisfies ToolExample<BeatErrorOrientationInput, BeatErrorOrientationOutput>;

export const beatErrorOrientationTool = createSimpleTool({
  calculate: (input) =>
    screenBeatErrorOrientationDifference({
      horizontalBeatErrorMilliseconds:
        input.horizontalBeatErrorMilliseconds as number,
      maximumAllowedOrientationDifferenceMilliseconds:
        input.maximumAllowedOrientationDifferenceMilliseconds as number,
      verticalBeatErrorMilliseconds:
        input.verticalBeatErrorMilliseconds as number,
    }),
  description:
    "Compare horizontal and vertical beat-error observations against an explicit difference limit without assigning a single-cause mechanical diagnosis.",
  id: "horology/beat-error-orientation-difference-screen",
  inputs: [
    {
      id: "horizontalBeatErrorMilliseconds",
      kind: "number",
      label: "Horizontal beat-error observation",
      minimum: 0,
      unit: "ms",
    },
    {
      id: "maximumAllowedOrientationDifferenceMilliseconds",
      kind: "number",
      label: "Maximum allowed orientation difference",
      minimum: 0,
      unit: "ms",
    },
    {
      id: "verticalBeatErrorMilliseconds",
      kind: "number",
      label: "Vertical beat-error observation",
      minimum: 0,
      unit: "ms",
    },
  ],
  outputs: [
    {
      id: "absoluteDifferenceMilliseconds",
      kind: "number",
      label: "Absolute orientation difference",
      minimum: 0,
      unit: "ms",
    },
    { id: "diagnosisCaution", kind: "string", label: "Diagnosis caution" },
    {
      id: "largerBeatErrorMilliseconds",
      kind: "number",
      label: "Larger beat-error observation",
      minimum: 0,
      unit: "ms",
    },
    {
      id: "withinCallerDifferenceLimit",
      kind: "boolean",
      label: "Within caller difference limit",
    },
  ],
  title: "Beat Error Orientation Difference Screen",
});

export const runBeatErrorOrientation = beatErrorOrientationTool.execute;
export default beatErrorOrientationTool;
