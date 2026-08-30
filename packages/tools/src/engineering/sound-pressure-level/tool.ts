import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SoundPressureLevelInput = Readonly<{
  readonly rmsPressurePascals: number;
  readonly referencePressurePascals: number;
}>;
export type SoundPressureLevelOutput = Readonly<{
  readonly levelDecibels: number;
}>;

export const calculateSoundPressureLevel = (
  x: SoundPressureLevelInput,
): SoundPressureLevelOutput => {
  if (!Number.isFinite(x.rmsPressurePascals) || x.rmsPressurePascals < 0)
    simpleError("rmsPressurePascals", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.referencePressurePascals) ||
    x.referencePressurePascals < 0
  )
    simpleError(
      "referencePressurePascals",
      "Provide a finite number at least 0.",
    );
  const levelDecibels =
    20 * Math.log10(x.rmsPressurePascals / x.referencePressurePascals);
  if (!Number.isFinite(levelDecibels))
    simpleError(
      "levelDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { levelDecibels: Object.is(levelDecibels, -0) ? 0 : levelDecibels };
};

export const example = {
  input: { rmsPressurePascals: 0.2, referencePressurePascals: 0.00002 },
  output: { levelDecibels: 80 },
} satisfies ToolExample<SoundPressureLevelInput, SoundPressureLevelOutput>;

export const tool = createSimpleTool({
  id: "engineering/sound-pressure-level",
  title: "Sound Pressure Level",
  description:
    "Sound pressure level 20log₁₀(prms/pref) in dB, using an explicitly supplied reference pressure such as 20 µPa in air.",
  inputs: [
    {
      id: "rmsPressurePascals",
      kind: "number",
      label: "Rms Pressure Pascals",
      unit: "Pa",
      minimum: 0,
    },
    {
      id: "referencePressurePascals",
      kind: "number",
      label: "Reference Pressure Pascals",
      unit: "Pa",
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
    calculateSoundPressureLevel({
      rmsPressurePascals: input.rmsPressurePascals as number,
      referencePressurePascals: input.referencePressurePascals as number,
    }),
});
export const soundPressureLevelTool = tool;
export const runSoundPressureLevel = tool.execute;
export default tool;
