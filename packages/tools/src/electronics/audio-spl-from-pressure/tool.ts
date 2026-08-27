import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const audioSplFromPressureExample = {
  input: { soundPressurePa: 1 },
} satisfies ToolExample<{
  readonly soundPressurePa: number;
}>;

export const audioSplFromPressureTool = createSimpleTool({
  id: "electronics/audio-spl-from-pressure",
  title: "SPL From Pressure",
  description:
    "Convert sound pressure to sound pressure level as splDb = 20 * log10(soundPressurePa / 0.00002) referenced to 20 micropascals.",
  inputs: [
    {
      description: "RMS sound pressure.",
      id: "soundPressurePa",
      kind: "number",
      label: "Sound Pressure",
      unit: "Pa",
    },
  ],
  outputs: [
    {
      description: "Sound pressure level relative to 20 uPa.",
      id: "soundPressureLevelDb",
      kind: "number",
      label: "SPL",
      unit: "dB SPL",
    },
  ],
  calculate: (input) => {
    const soundPressurePa = input.soundPressurePa as number;
    if (!(soundPressurePa > 0))
      simpleError("soundPressurePa", "Sound pressure must be positive.");
    return { soundPressureLevelDb: 20 * Math.log10(soundPressurePa / 0.00002) };
  },
});
export const runAudioSplFromPressure = audioSplFromPressureTool.execute;
export default audioSplFromPressureTool;
