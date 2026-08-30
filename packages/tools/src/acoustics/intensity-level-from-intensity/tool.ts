import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IntensityLevelFromIntensityInput = Readonly<{
  readonly intensityWattsPerSquareMeter: number;
}>;
export type IntensityLevelFromIntensityOutput = Readonly<{
  readonly levelDecibels: number;
}>;

export const calculateIntensityLevelFromIntensity = (
  x: IntensityLevelFromIntensityInput,
): IntensityLevelFromIntensityOutput => {
  if (
    !Number.isFinite(x.intensityWattsPerSquareMeter) ||
    x.intensityWattsPerSquareMeter <= 0
  )
    simpleError(
      "intensityWattsPerSquareMeter",
      "Provide a finite positive number.",
    );
  const levelDecibels = 10 * Math.log10(x.intensityWattsPerSquareMeter / 1e-12);
  if (!Number.isFinite(levelDecibels))
    simpleError(
      "levelDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { levelDecibels: Object.is(levelDecibels, -0) ? 0 : levelDecibels };
};

export const example = {
  input: {
    intensityWattsPerSquareMeter: 0.000001,
  },
  output: { levelDecibels: 60 },
} satisfies ToolExample<
  IntensityLevelFromIntensityInput,
  IntensityLevelFromIntensityOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/intensity-level-from-intensity",
  title: "Intensity Level From Intensity",
  description: "Sound-intensity level in dB relative to 10^-12 W/m².",
  inputs: [
    {
      id: "intensityWattsPerSquareMeter",
      kind: "number",
      label: "Intensity Watts Per Square Meter",
      unit: "W/m2",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "levelDecibels",
      kind: "number",
      label: "Level Decibels",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateIntensityLevelFromIntensity({
      intensityWattsPerSquareMeter:
        input.intensityWattsPerSquareMeter as number,
    }),
});
export const intensityLevelFromIntensityTool = tool;
export const runIntensityLevelFromIntensity = tool.execute;
export default tool;
