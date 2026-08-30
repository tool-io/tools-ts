import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PianoKeyNumberFromMidiInput = Readonly<{
  readonly midiNote: number;
}>;
export type PianoKeyNumberFromMidiOutput = Readonly<{
  readonly pianoKeyNumber: number;
}>;

export const calculatePianoKeyNumberFromMidi = (
  x: PianoKeyNumberFromMidiInput,
): PianoKeyNumberFromMidiOutput => {
  if (!Number.isFinite(x.midiNote) || x.midiNote < 0)
    simpleError("midiNote", "Provide a finite nonnegative number.");
  if (!(Number.isInteger(x.midiNote) && x.midiNote >= 21 && x.midiNote <= 108))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const pianoKeyNumber = x.midiNote - 20;
  if (!Number.isFinite(pianoKeyNumber))
    simpleError(
      "pianoKeyNumber",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { pianoKeyNumber: Object.is(pianoKeyNumber, -0) ? 0 : pianoKeyNumber };
};

export const example = {
  input: {
    midiNote: 69,
  },
  output: { pianoKeyNumber: 49 },
} satisfies ToolExample<
  PianoKeyNumberFromMidiInput,
  PianoKeyNumberFromMidiOutput
>;

export const tool = createSimpleTool({
  id: "music/piano-key-number-from-midi",
  title: "Piano Key Number From Midi",
  description:
    "88-key piano key number, 1=A0 through 88=C8, from MIDI note number 21–108.",
  inputs: [{ id: "midiNote", kind: "number", label: "Midi Note", minimum: 0 }],
  outputs: [
    { id: "pianoKeyNumber", kind: "number", label: "Piano Key Number" },
  ],
  calculate: (input) =>
    calculatePianoKeyNumberFromMidi({
      midiNote: input.midiNote as number,
    }),
});
export const pianoKeyNumberFromMidiTool = tool;
export const runPianoKeyNumberFromMidi = tool.execute;
export default tool;
