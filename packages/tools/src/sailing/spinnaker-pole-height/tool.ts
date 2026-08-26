import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpinnakerPoleHeightInput = {
  readonly elevationDegrees?: number;
  readonly poleLengthMeters: number;
};

export type SpinnakerPoleHeightOutput = {
  readonly poleTipHeightMeters: number;
};

const DEFAULT_ELEVATION_DEGREES = 15;

export const spinnakerPoleHeightExample = {
  input: { poleLengthMeters: 4 },
  output: { poleTipHeightMeters: 1.035276180410083 },
} satisfies ToolExample<SpinnakerPoleHeightInput, SpinnakerPoleHeightOutput>;

export const calculateSpinnakerPoleHeight = (
  input: SpinnakerPoleHeightInput,
): SpinnakerPoleHeightOutput => {
  if (input.poleLengthMeters <= 0)
    simpleError(
      "poleLengthMeters",
      "The pole length must be positive.",
      "invalid_input",
    );
  const elevationDegrees = input.elevationDegrees ?? DEFAULT_ELEVATION_DEGREES;
  return {
    poleTipHeightMeters:
      input.poleLengthMeters * Math.sin((elevationDegrees * Math.PI) / 180),
  };
};

export const spinnakerPoleHeightTool = createSimpleTool({
  calculate: (input) =>
    calculateSpinnakerPoleHeight(input as unknown as SpinnakerPoleHeightInput),
  description:
    "Compute how high the outboard tip of a spinnaker pole sits above the mast attachment using pole length times the sine of the elevation angle.",
  id: "sailing/spinnaker-pole-height",
  inputs: [
    {
      default: DEFAULT_ELEVATION_DEGREES,
      description:
        "Elevation of the pole above horizontal; zero is square, forty five degrees is the highest useful angle.",
      id: "elevationDegrees",
      kind: "number",
      label: "Elevation",
      maximum: 45,
      minimum: 0,
      unit: "deg",
    },
    {
      description: "Overall length of the spinnaker pole.",
      format: "length-m",
      id: "poleLengthMeters",
      kind: "number",
      label: "Pole length",
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Vertical rise of the pole tip above the mast attachment.",
      format: "length-m",
      id: "poleTipHeightMeters",
      kind: "number",
      label: "Pole tip height",
      unit: "m",
    },
  ],
  title: "Spinnaker Pole Height",
});
export const runSpinnakerPoleHeight = spinnakerPoleHeightTool.execute;
export default spinnakerPoleHeightTool;
