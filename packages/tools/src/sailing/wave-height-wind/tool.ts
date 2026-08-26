import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaveHeightWindInput = {
  windSpeedKt: number;
};

export type WaveHeightWindOutput = {
  significantWaveHeightMeters: number;
};

const METERS_PER_SECOND_PER_KNOT = 0.514444;
const GRAVITY_METERS_PER_SECOND_SQUARED = 9.80665;
const FULLY_DEVELOPED_HEIGHT_COEFFICIENT = 0.21;

export const waveHeightWindExample = {
  input: { windSpeedKt: 20 },
  output: { significantWaveHeightMeters: 2.266912844592598 },
} satisfies ToolExample<WaveHeightWindInput, WaveHeightWindOutput>;

export const calculateWaveHeightWind = (
  input: WaveHeightWindInput,
): WaveHeightWindOutput => {
  if (input.windSpeedKt <= 0)
    simpleError("windSpeedKt", "Wind speed must be positive.", "invalid_input");
  return {
    significantWaveHeightMeters:
      (FULLY_DEVELOPED_HEIGHT_COEFFICIENT *
        (input.windSpeedKt * METERS_PER_SECOND_PER_KNOT) ** 2) /
      GRAVITY_METERS_PER_SECOND_SQUARED,
  };
};

export const waveHeightWindTool = createSimpleTool({
  calculate: (input) =>
    calculateWaveHeightWind(input as unknown as WaveHeightWindInput),
  description:
    "Estimate deep-water significant wave height for a fully developed sea as 0.21 U²/g, converting the supplied wind speed from knots to meters per second.",
  id: "sailing/wave-height-wind",
  inputs: [
    {
      description: "Sustained wind speed.",
      id: "windSpeedKt",
      kind: "number",
      label: "Wind speed",
      minimum: 0,
      unit: "kn",
    },
  ],
  outputs: [
    {
      description: "Significant wave height for a fully developed sea.",
      format: "length-m",
      id: "significantWaveHeightMeters",
      kind: "number",
      label: "Significant wave height",
      unit: "m",
    },
  ],
  title: "Fully Developed Wave Height",
});
export const runWaveHeightWind = waveHeightWindTool.execute;
export default waveHeightWindTool;
