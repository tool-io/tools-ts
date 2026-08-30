import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScientificPitchNotationOctaveInput = Readonly<{
  readonly midiNote: number;
}>;
export type ScientificPitchNotationOctaveOutput = Readonly<{
  readonly octave: number;
}>;

export const calculateScientificPitchNotationOctave = (
  x: ScientificPitchNotationOctaveInput,
): ScientificPitchNotationOctaveOutput => {
  if (!Number.isFinite(x.midiNote) || x.midiNote < 0)
    simpleError("midiNote", "Provide a finite nonnegative number.");
  if (!(Number.isInteger(x.midiNote) && x.midiNote <= 127))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const octave = Math.floor(x.midiNote / 12) - 1;
  if (!Number.isFinite(octave))
    simpleError(
      "octave",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { octave: Object.is(octave, -0) ? 0 : octave };
};

export const example = {
  input: {
    midiNote: 60,
  },
  output: { octave: 4 },
} satisfies ToolExample<
  ScientificPitchNotationOctaveInput,
  ScientificPitchNotationOctaveOutput
>;

export const tool = createSimpleTool({
  id: "music/scientific-pitch-notation-octave",
  title: "Scientific Pitch Notation Octave",
  description:
    "Scientific-pitch octave number for a MIDI note, where MIDI 60 is C4.",
  inputs: [{ id: "midiNote", kind: "number", label: "Midi Note", minimum: 0 }],
  outputs: [{ id: "octave", kind: "number", label: "Octave" }],
  calculate: (input) =>
    calculateScientificPitchNotationOctave({
      midiNote: input.midiNote as number,
    }),
});
export const scientificPitchNotationOctaveTool = tool;
export const runScientificPitchNotationOctave = tool.execute;
export default tool;
