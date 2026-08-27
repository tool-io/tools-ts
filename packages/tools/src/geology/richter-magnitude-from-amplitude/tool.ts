import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RichterMagnitudeFromAmplitudeInput = {
  readonly amplitudeMillimeters: number;
  readonly referenceAmplitudeMillimeters?: number;
};

export type RichterMagnitudeFromAmplitudeOutput = {
  readonly localMagnitude: number;
};

export const calculateRichterMagnitudeFromAmplitude = (
  input: RichterMagnitudeFromAmplitudeInput,
): RichterMagnitudeFromAmplitudeOutput => {
  const referenceAmplitudeMillimeters =
    input.referenceAmplitudeMillimeters ?? 0.001;
  if (!(input.amplitudeMillimeters > 0))
    simpleError(
      "amplitudeMillimeters",
      "Trace amplitude must be greater than zero.",
      "invalid_amplitude",
    );
  if (!(referenceAmplitudeMillimeters > 0))
    simpleError(
      "referenceAmplitudeMillimeters",
      "Reference amplitude must be greater than zero.",
      "invalid_amplitude",
    );
  return {
    localMagnitude: Math.log10(
      input.amplitudeMillimeters / referenceAmplitudeMillimeters,
    ),
  };
};

export const richterMagnitudeFromAmplitudeExample = {
  input: { amplitudeMillimeters: 10, referenceAmplitudeMillimeters: 0.001 },
  output: { localMagnitude: 4 },
} satisfies ToolExample<
  RichterMagnitudeFromAmplitudeInput,
  RichterMagnitudeFromAmplitudeOutput
>;

export const richterMagnitudeFromAmplitudeTool = createSimpleTool({
  id: "geology/richter-magnitude-from-amplitude",
  title: "Richter Magnitude From Amplitude Calculator",
  description:
    "Original Richter (1935) local magnitude ML = log10(A / A0), comparing maximum Wood-Anderson trace amplitude in millimeters with the zero-magnitude reference amplitude at the same epicentral distance (0.001 mm at 100 km by definition).",
  inputs: [
    {
      description:
        "Maximum trace amplitude on a Wood-Anderson seismograph, in millimeters.",
      id: "amplitudeMillimeters",
      kind: "number",
      label: "Amplitude",
      minimum: 0,
    },
    {
      default: 0.001,
      description:
        "Zero-magnitude reference amplitude at the same distance, in millimeters.",
      id: "referenceAmplitudeMillimeters",
      kind: "number",
      label: "Reference amplitude",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Local (Richter) magnitude ML.",
      id: "localMagnitude",
      kind: "number",
      label: "ML",
    },
  ],
  calculate: (input) =>
    calculateRichterMagnitudeFromAmplitude(
      input as unknown as RichterMagnitudeFromAmplitudeInput,
    ),
});

export const runRichterMagnitudeFromAmplitude =
  richterMagnitudeFromAmplitudeTool.execute;
export default richterMagnitudeFromAmplitudeTool;
