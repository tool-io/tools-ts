import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaveNumberCalculatorInput = Readonly<{
  readonly wavelengthMeters: number;
}>;
export type WaveNumberCalculatorOutput = Readonly<{
  readonly waveNumberRadiansPerMeter: number;
}>;

export const calculateWaveNumberCalculator = (
  x: WaveNumberCalculatorInput,
): WaveNumberCalculatorOutput => {
  if (!Number.isFinite(x.wavelengthMeters) || x.wavelengthMeters <= 0)
    simpleError("wavelengthMeters", "Provide a finite positive number.");
  const waveNumberRadiansPerMeter = (2 * Math.PI) / x.wavelengthMeters;
  if (!Number.isFinite(waveNumberRadiansPerMeter))
    simpleError(
      "waveNumberRadiansPerMeter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    waveNumberRadiansPerMeter: Object.is(waveNumberRadiansPerMeter, -0)
      ? 0
      : waveNumberRadiansPerMeter,
  };
};

export const example = {
  input: {
    wavelengthMeters: 1,
  },
  output: { waveNumberRadiansPerMeter: 6.283185307179586 },
} satisfies ToolExample<WaveNumberCalculatorInput, WaveNumberCalculatorOutput>;

export const tool = createSimpleTool({
  id: "acoustics/wave-number-calculator",
  title: "Wave Number Calculator",
  description:
    "Angular wave number in radians per metre from positive wavelength.",
  inputs: [
    {
      id: "wavelengthMeters",
      kind: "number",
      label: "Wavelength Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "waveNumberRadiansPerMeter",
      kind: "number",
      label: "Wave Number Radians Per Meter",
      unit: "rad/m",
    },
  ],
  calculate: (input) =>
    calculateWaveNumberCalculator({
      wavelengthMeters: input.wavelengthMeters as number,
    }),
});
export const waveNumberCalculatorTool = tool;
export const runWaveNumberCalculator = tool.execute;
export default tool;
