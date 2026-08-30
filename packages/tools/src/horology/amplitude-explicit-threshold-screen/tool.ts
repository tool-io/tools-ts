import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AmplitudeThresholdInput = {
  readonly maximumExpectedAmplitudeDegrees: number;
  readonly measuredAmplitudeDegrees: number;
  readonly minimumHealthyAmplitudeDegrees: number;
};

export type AmplitudeThresholdOutput = {
  readonly amplitudeAboveMaximum: number;
  readonly amplitudeBelowMinimum: number;
  readonly healthClaimCaution: string;
  readonly withinCallerRange: boolean;
};

export const screenAmplitudeAgainstThresholds = (
  input: AmplitudeThresholdInput,
): AmplitudeThresholdOutput => {
  if (
    !Number.isFinite(input.measuredAmplitudeDegrees) ||
    input.measuredAmplitudeDegrees < 0
  )
    simpleError(
      "measuredAmplitudeDegrees",
      "Measured amplitude must be finite and nonnegative.",
      "measured_amplitude_invalid",
    );
  if (
    !Number.isFinite(input.minimumHealthyAmplitudeDegrees) ||
    input.minimumHealthyAmplitudeDegrees <= 0
  )
    simpleError(
      "minimumHealthyAmplitudeDegrees",
      "Minimum amplitude must be finite and positive.",
      "minimum_amplitude_invalid",
    );
  if (
    !Number.isFinite(input.maximumExpectedAmplitudeDegrees) ||
    input.maximumExpectedAmplitudeDegrees <=
      input.minimumHealthyAmplitudeDegrees
  )
    simpleError(
      "maximumExpectedAmplitudeDegrees",
      "Maximum amplitude must be finite and above the minimum.",
      "maximum_amplitude_invalid",
    );
  return {
    amplitudeAboveMaximum: Math.max(
      0,
      input.measuredAmplitudeDegrees - input.maximumExpectedAmplitudeDegrees,
    ),
    amplitudeBelowMinimum: Math.max(
      0,
      input.minimumHealthyAmplitudeDegrees - input.measuredAmplitudeDegrees,
    ),
    healthClaimCaution:
      "Amplitude is one diagnostic observation, not a stand-alone health verdict. Compare the same caliber at matched winding, position, temperature, lift angle, and measurement method.",
    withinCallerRange:
      input.measuredAmplitudeDegrees >= input.minimumHealthyAmplitudeDegrees &&
      input.measuredAmplitudeDegrees <= input.maximumExpectedAmplitudeDegrees,
  };
};

export const amplitudeThresholdExample = {
  input: {
    maximumExpectedAmplitudeDegrees: 320,
    measuredAmplitudeDegrees: 280,
    minimumHealthyAmplitudeDegrees: 250,
  },
  output: {
    amplitudeAboveMaximum: 0,
    amplitudeBelowMinimum: 0,
    healthClaimCaution:
      "Amplitude is one diagnostic observation, not a stand-alone health verdict. Compare the same caliber at matched winding, position, temperature, lift angle, and measurement method.",
    withinCallerRange: true,
  },
} satisfies ToolExample<AmplitudeThresholdInput, AmplitudeThresholdOutput>;

export const amplitudeThresholdTool = createSimpleTool({
  calculate: (input) =>
    screenAmplitudeAgainstThresholds({
      maximumExpectedAmplitudeDegrees:
        input.maximumExpectedAmplitudeDegrees as number,
      measuredAmplitudeDegrees: input.measuredAmplitudeDegrees as number,
      minimumHealthyAmplitudeDegrees:
        input.minimumHealthyAmplitudeDegrees as number,
    }),
  description:
    "Screen measured balance amplitude against explicit caller-supplied minimum and maximum values without applying a universal healthy-degree target.",
  id: "horology/amplitude-explicit-threshold-screen",
  inputs: [
    {
      id: "maximumExpectedAmplitudeDegrees",
      kind: "number",
      label: "Maximum expected amplitude",
      minimum: 0,
      unit: "deg",
    },
    {
      id: "measuredAmplitudeDegrees",
      kind: "number",
      label: "Measured amplitude",
      minimum: 0,
      unit: "deg",
    },
    {
      id: "minimumHealthyAmplitudeDegrees",
      kind: "number",
      label: "Minimum caller-defined amplitude",
      minimum: 0,
      unit: "deg",
    },
  ],
  outputs: [
    {
      id: "amplitudeAboveMaximum",
      kind: "number",
      label: "Amplitude above caller maximum",
      minimum: 0,
      unit: "deg",
    },
    {
      id: "amplitudeBelowMinimum",
      kind: "number",
      label: "Amplitude below caller minimum",
      minimum: 0,
      unit: "deg",
    },
    { id: "healthClaimCaution", kind: "string", label: "Health-claim caution" },
    {
      id: "withinCallerRange",
      kind: "boolean",
      label: "Within caller amplitude range",
    },
  ],
  title: "Amplitude Explicit Threshold Screen",
});

export const runAmplitudeThreshold = amplitudeThresholdTool.execute;
export default amplitudeThresholdTool;
