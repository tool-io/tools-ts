import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AcousticIntensityFromSplInput = Readonly<{
  readonly soundPressureLevelDecibels: number;
}>;
export type AcousticIntensityFromSplOutput = Readonly<{
  readonly wattsPerSquareMeter: number;
}>;

export const calculateAcousticIntensityFromSpl = (
  x: AcousticIntensityFromSplInput,
): AcousticIntensityFromSplOutput => {
  if (!Number.isFinite(x.soundPressureLevelDecibels))
    simpleError("soundPressureLevelDecibels", "Provide a finite number.");
  const wattsPerSquareMeter = 1e-12 * 10 ** (x.soundPressureLevelDecibels / 10);
  if (!Number.isFinite(wattsPerSquareMeter))
    simpleError(
      "wattsPerSquareMeter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    wattsPerSquareMeter: Object.is(wattsPerSquareMeter, -0)
      ? 0
      : wattsPerSquareMeter,
  };
};

export const example = {
  input: {
    soundPressureLevelDecibels: 120,
  },
  output: { wattsPerSquareMeter: 1 },
} satisfies ToolExample<
  AcousticIntensityFromSplInput,
  AcousticIntensityFromSplOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/acoustic-intensity-from-spl",
  title: "Acoustic Intensity From Spl",
  description:
    "Plane-wave free-field intensity from sound-pressure level, assuming the conventional 10^-12 W/m² reference.",
  inputs: [
    {
      id: "soundPressureLevelDecibels",
      kind: "number",
      label: "Sound Pressure Level Decibels",
      unit: "dB",
    },
  ],
  outputs: [
    {
      id: "wattsPerSquareMeter",
      kind: "number",
      label: "Watts Per Square Meter",
      unit: "W/m2",
    },
  ],
  calculate: (input) =>
    calculateAcousticIntensityFromSpl({
      soundPressureLevelDecibels: input.soundPressureLevelDecibels as number,
    }),
});
export const acousticIntensityFromSplTool = tool;
export const runAcousticIntensityFromSpl = tool.execute;
export default tool;
