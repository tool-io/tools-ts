import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type WindOscillationAmplitudeInput = {
  readonly maxHeadingDeg: number;
  readonly minHeadingDeg: number;
};

export type WindOscillationAmplitudeOutput = {
  readonly amplitudeDegrees: number;
};

export const windOscillationAmplitudeExample = {
  input: { maxHeadingDeg: 300, minHeadingDeg: 280 },
  output: { amplitudeDegrees: 10 },
} satisfies ToolExample<
  WindOscillationAmplitudeInput,
  WindOscillationAmplitudeOutput
>;

export const calculateWindOscillationAmplitude = (
  input: WindOscillationAmplitudeInput,
): WindOscillationAmplitudeOutput => {
  const separationDegrees = Math.abs(
    ((input.maxHeadingDeg - input.minHeadingDeg + 540) % 360) - 180,
  );
  return {
    amplitudeDegrees: separationDegrees / 2,
  };
};

export const windOscillationAmplitudeTool = createSimpleTool({
  id: "sailing/wind-oscillation-amplitude",
  title: "Oscillation Amplitude",
  description:
    "Compute half the shortest circular separation between the two extreme compass headings, including oscillations that cross north.",
  inputs: [
    {
      description: "Largest heading observed during the oscillation.",
      id: "maxHeadingDeg",
      kind: "number",
      label: "Maximum heading",
      maximum: 360,
      minimum: 0,
      unit: "\u00B0",
    },
    {
      description: "Smallest heading observed during the oscillation.",
      id: "minHeadingDeg",
      kind: "number",
      label: "Minimum heading",
      maximum: 360,
      minimum: 0,
      unit: "\u00B0",
    },
  ],
  outputs: [
    {
      description: "Half of the heading spread covered by the oscillation.",
      format: "angle-deg",
      id: "amplitudeDegrees",
      kind: "number",
      label: "Amplitude",
      unit: "\u00B0",
    },
  ],
  calculate: (input) =>
    calculateWindOscillationAmplitude(
      input as unknown as WindOscillationAmplitudeInput,
    ),
});

export const runWindOscillationAmplitude = windOscillationAmplitudeTool.execute;
export default windOscillationAmplitudeTool;
