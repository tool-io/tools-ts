import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly beamPowerWatts: number;
  readonly spotAreaSquareMeters: number;
  readonly keyholeThresholdWPerM2: number;
}>;
export type Output = Readonly<{
  readonly intensityWPerM2: number;
  readonly thresholdRatio: number;
  readonly predictedMode: string;
}>;

export const calculate = (input: Input): Output => {
  if (input.spotAreaSquareMeters <= 0 || input.keyholeThresholdWPerM2 <= 0)
    simpleError(
      "spotAreaSquareMeters",
      "Spot area and threshold must be positive.",
      "invalid_threshold",
    );
  const intensityWPerM2 = input.beamPowerWatts / input.spotAreaSquareMeters;
  return {
    intensityWPerM2,
    thresholdRatio: intensityWPerM2 / input.keyholeThresholdWPerM2,
    predictedMode:
      intensityWPerM2 >= input.keyholeThresholdWPerM2
        ? "keyhole"
        : "conduction",
  };
};

export const exampleInput = {
  beamPowerWatts: 100,
  spotAreaSquareMeters: 0.01,
  keyholeThresholdWPerM2: 5000,
} satisfies Input;
export const exampleOutput = {
  intensityWPerM2: 10000,
  thresholdRatio: 2,
  predictedMode: "keyhole",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      beamPowerWatts: input.beamPowerWatts as number,
      spotAreaSquareMeters: input.spotAreaSquareMeters as number,
      keyholeThresholdWPerM2: input.keyholeThresholdWPerM2 as number,
    }),
  description:
    "Compare weld intensity with a caller-supplied keyhole transition threshold.",
  id: "laser/welding-mode-threshold",
  inputs: [
    {
      id: "beamPowerWatts",
      label: "Beam power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "spotAreaSquareMeters",
      label: "Spot area",
      kind: "number",
      minimum: 0,
      unit: "m²",
    },
    {
      id: "keyholeThresholdWPerM2",
      label: "Keyhole threshold intensity",
      kind: "number",
      minimum: 0,
      unit: "W/m²",
    },
  ],
  outputs: [
    {
      id: "intensityWPerM2",
      label: "Weld intensity",
      kind: "number",
      minimum: 0,
      unit: "W/m²",
    },
    {
      id: "thresholdRatio",
      label: "Intensity-to-threshold ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "predictedMode",
      label: "Predicted welding mode",
      kind: "string",
      enum: ["conduction", "keyhole"],
    },
  ],
  title: "Welding Mode Threshold",
});

export const run = tool.execute;
export default tool;
