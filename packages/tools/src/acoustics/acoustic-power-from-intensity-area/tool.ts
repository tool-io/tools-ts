import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AcousticPowerFromIntensityAreaInput = Readonly<{
  readonly intensityWattsPerSquareMeter: number;
  readonly areaSquareMeters: number;
}>;
export type AcousticPowerFromIntensityAreaOutput = Readonly<{
  readonly powerWatts: number;
}>;

export const calculateAcousticPowerFromIntensityArea = (
  x: AcousticPowerFromIntensityAreaInput,
): AcousticPowerFromIntensityAreaOutput => {
  if (
    !Number.isFinite(x.intensityWattsPerSquareMeter) ||
    x.intensityWattsPerSquareMeter < 0
  )
    simpleError(
      "intensityWattsPerSquareMeter",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.areaSquareMeters) || x.areaSquareMeters < 0)
    simpleError("areaSquareMeters", "Provide a finite nonnegative number.");
  const powerWatts = x.intensityWattsPerSquareMeter * x.areaSquareMeters;
  if (!Number.isFinite(powerWatts))
    simpleError(
      "powerWatts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { powerWatts: Object.is(powerWatts, -0) ? 0 : powerWatts };
};

export const example = {
  input: {
    intensityWattsPerSquareMeter: 2,
    areaSquareMeters: 3,
  },
  output: { powerWatts: 6 },
} satisfies ToolExample<
  AcousticPowerFromIntensityAreaInput,
  AcousticPowerFromIntensityAreaOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/acoustic-power-from-intensity-area",
  title: "Acoustic Power From Intensity Area",
  description:
    "Acoustic power crossing an area under uniform normal incidence.",
  inputs: [
    {
      id: "intensityWattsPerSquareMeter",
      kind: "number",
      label: "Intensity Watts Per Square Meter",
      unit: "W/m2",
      minimum: 0,
    },
    {
      id: "areaSquareMeters",
      kind: "number",
      label: "Area Square Meters",
      unit: "m2",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "powerWatts", kind: "number", label: "Power Watts", unit: "W" },
  ],
  calculate: (input) =>
    calculateAcousticPowerFromIntensityArea({
      intensityWattsPerSquareMeter:
        input.intensityWattsPerSquareMeter as number,
      areaSquareMeters: input.areaSquareMeters as number,
    }),
});
export const acousticPowerFromIntensityAreaTool = tool;
export const runAcousticPowerFromIntensityArea = tool.execute;
export default tool;
