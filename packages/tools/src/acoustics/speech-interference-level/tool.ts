import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpeechInterferenceLevelInput = Readonly<{
  readonly level500Hz: number;
  readonly level1000Hz: number;
  readonly level2000Hz: number;
  readonly level4000Hz: number;
}>;
export type SpeechInterferenceLevelOutput = Readonly<{
  readonly silDecibels: number;
}>;

export const calculateSpeechInterferenceLevel = (
  x: SpeechInterferenceLevelInput,
): SpeechInterferenceLevelOutput => {
  if (!Number.isFinite(x.level500Hz))
    simpleError("level500Hz", "Provide a finite number.");
  if (!Number.isFinite(x.level1000Hz))
    simpleError("level1000Hz", "Provide a finite number.");
  if (!Number.isFinite(x.level2000Hz))
    simpleError("level2000Hz", "Provide a finite number.");
  if (!Number.isFinite(x.level4000Hz))
    simpleError("level4000Hz", "Provide a finite number.");
  const silDecibels =
    (x.level500Hz + x.level1000Hz + x.level2000Hz + x.level4000Hz) / 4;
  if (!Number.isFinite(silDecibels))
    simpleError(
      "silDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { silDecibels: Object.is(silDecibels, -0) ? 0 : silDecibels };
};

export const example = {
  input: {
    level500Hz: 60,
    level1000Hz: 60,
    level2000Hz: 60,
    level4000Hz: 60,
  },
  output: { silDecibels: 60 },
} satisfies ToolExample<
  SpeechInterferenceLevelInput,
  SpeechInterferenceLevelOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/speech-interference-level",
  title: "Speech Interference Level",
  description:
    "Arithmetic mean of speech-band octave levels at 500, 1000, 2000 and 4000 Hz.",
  inputs: [
    { id: "level500Hz", kind: "number", label: "Level 500 Hz", unit: "dB" },
    { id: "level1000Hz", kind: "number", label: "Level 1000 Hz", unit: "dB" },
    { id: "level2000Hz", kind: "number", label: "Level 2000 Hz", unit: "dB" },
    { id: "level4000Hz", kind: "number", label: "Level 4000 Hz", unit: "dB" },
  ],
  outputs: [
    { id: "silDecibels", kind: "number", label: "Sil Decibels", unit: "dB" },
  ],
  calculate: (input) =>
    calculateSpeechInterferenceLevel({
      level500Hz: input.level500Hz as number,
      level1000Hz: input.level1000Hz as number,
      level2000Hz: input.level2000Hz as number,
      level4000Hz: input.level4000Hz as number,
    }),
});
export const speechInterferenceLevelTool = tool;
export const runSpeechInterferenceLevel = tool.execute;
export default tool;
