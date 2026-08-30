import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SoundEnergyDensityInput = Readonly<{
  readonly intensityWattsPerSquareMeter: number;
  readonly speedMetersPerSecond: number;
}>;
export type SoundEnergyDensityOutput = Readonly<{
  readonly joulesPerCubicMeter: number;
}>;

export const calculateSoundEnergyDensity = (
  x: SoundEnergyDensityInput,
): SoundEnergyDensityOutput => {
  if (
    !Number.isFinite(x.intensityWattsPerSquareMeter) ||
    x.intensityWattsPerSquareMeter < 0
  )
    simpleError(
      "intensityWattsPerSquareMeter",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond <= 0)
    simpleError("speedMetersPerSecond", "Provide a finite positive number.");
  const joulesPerCubicMeter =
    x.intensityWattsPerSquareMeter / x.speedMetersPerSecond;
  if (!Number.isFinite(joulesPerCubicMeter))
    simpleError(
      "joulesPerCubicMeter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    joulesPerCubicMeter: Object.is(joulesPerCubicMeter, -0)
      ? 0
      : joulesPerCubicMeter,
  };
};

export const example = {
  input: {
    intensityWattsPerSquareMeter: 1,
    speedMetersPerSecond: 343,
  },
  output: { joulesPerCubicMeter: 0.0029154518950437317 },
} satisfies ToolExample<SoundEnergyDensityInput, SoundEnergyDensityOutput>;

export const tool = createSimpleTool({
  id: "acoustics/sound-energy-density",
  title: "Sound Energy Density",
  description:
    "Acoustic energy density of a traveling plane wave from intensity divided by propagation speed.",
  inputs: [
    {
      id: "intensityWattsPerSquareMeter",
      kind: "number",
      label: "Intensity Watts Per Square Meter",
      unit: "W/m2",
      minimum: 0,
    },
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "joulesPerCubicMeter",
      kind: "number",
      label: "Joules Per Cubic Meter",
      unit: "J/m3",
    },
  ],
  calculate: (input) =>
    calculateSoundEnergyDensity({
      intensityWattsPerSquareMeter:
        input.intensityWattsPerSquareMeter as number,
      speedMetersPerSecond: input.speedMetersPerSecond as number,
    }),
});
export const soundEnergyDensityTool = tool;
export const runSoundEnergyDensity = tool.execute;
export default tool;
