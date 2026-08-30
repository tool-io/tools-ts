import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FrequencyToNearestMidiInput = Readonly<{
  readonly frequencyHertz: number;
}>;
export type FrequencyToNearestMidiOutput = Readonly<{
  readonly midiNote: number;
}>;

export const calculateFrequencyToNearestMidi = (
  x: FrequencyToNearestMidiInput,
): FrequencyToNearestMidiOutput => {
  if (!Number.isFinite(x.frequencyHertz) || x.frequencyHertz <= 0)
    simpleError("frequencyHertz", "Provide a finite positive number.");
  if (!(
    Math.round(69 + 12 * Math.log2(x.frequencyHertz / 440)) >= 0 &&
    Math.round(69 + 12 * Math.log2(x.frequencyHertz / 440)) <= 127
  ))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const midiNote = Math.round(69 + 12 * Math.log2(x.frequencyHertz / 440));
  if (!Number.isFinite(midiNote))
    simpleError(
      "midiNote",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { midiNote: Object.is(midiNote, -0) ? 0 : midiNote };
};

export const example = {
  input: {
    frequencyHertz: 440,
  },
  output: { midiNote: 69 },
} satisfies ToolExample<
  FrequencyToNearestMidiInput,
  FrequencyToNearestMidiOutput
>;

export const tool = createSimpleTool({
  id: "music/frequency-to-nearest-midi",
  title: "Frequency To Nearest Midi",
  description:
    "Nearest equal-tempered MIDI note number to a positive frequency, with A4=440 Hz as MIDI 69.",
  inputs: [
    {
      id: "frequencyHertz",
      kind: "number",
      label: "Frequency Hertz",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [{ id: "midiNote", kind: "number", label: "Midi Note" }],
  calculate: (input) =>
    calculateFrequencyToNearestMidi({
      frequencyHertz: input.frequencyHertz as number,
    }),
});
export const frequencyToNearestMidiTool = tool;
export const runFrequencyToNearestMidi = tool.execute;
export default tool;
