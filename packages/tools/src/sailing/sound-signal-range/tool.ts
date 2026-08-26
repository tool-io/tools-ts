import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SoundSignalRangeInput = {
  readonly whistleDecibels: number;
};

export type SoundSignalRangeOutput = {
  readonly soundRangeNm: number;
};

export const soundSignalRangeExample = {
  input: { whistleDecibels: 121 },
  output: { soundRangeNm: 1 },
} satisfies ToolExample<SoundSignalRangeInput, SoundSignalRangeOutput>;

export const calculateSoundSignalRange = (
  input: SoundSignalRangeInput,
): SoundSignalRangeOutput => ({
  soundRangeNm:
    input.whistleDecibels >= 130 ? 2 : input.whistleDecibels >= 110 ? 1 : 0.5,
});

export const soundSignalRangeTool = createSimpleTool({
  calculate: (input) =>
    calculateSoundSignalRange(input as unknown as SoundSignalRangeInput),
  description:
    "Estimate the audible range of a vessel sound signal from its whistle output level in decibels using two nautical miles above one hundred and thirty decibels, one nautical mile above one hundred and ten, and half a nautical mile otherwise.",
  id: "sailing/sound-signal-range",
  inputs: [
    {
      description: "Sound pressure level of the whistle at one metre.",
      id: "whistleDecibels",
      kind: "number",
      label: "Whistle loudness",
      maximum: 150,
      minimum: 90,
      unit: "dB",
    },
  ],
  outputs: [
    {
      description: "Approximate distance at which the signal can be heard.",
      format: "length-nm",
      id: "soundRangeNm",
      kind: "number",
      label: "Sound range",
      unit: "NM",
    },
  ],
  title: "Sound Signal Range",
});
export const runSoundSignalRange = soundSignalRangeTool.execute;
export default soundSignalRangeTool;
