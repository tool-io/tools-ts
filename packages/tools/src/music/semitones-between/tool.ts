import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const PITCH_CLASSES: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};
const NOTE_PATTERN = /^([A-Ga-g])([#b]*)(-?\d{1,2})$/u;

const toMidi = (note: string): number => {
  const match = NOTE_PATTERN.exec(note.trim());
  if (!match)
    simpleError(
      "fromNote",
      "Notes must look like C4, F#3, or Bb2.",
      "invalid_note",
    );
  const letter = (match![1] as string).toUpperCase();
  const accidentals = match![2] as string;
  const octave = Number(match![3]);
  let pitchClass = PITCH_CLASSES[letter] as number;
  for (const character of accidentals) pitchClass += character === "#" ? 1 : -1;
  return (octave + 1) * 12 + pitchClass;
};

export const semitonesBetweenTool = createSimpleTool({
  id: "music/semitones-between",
  title: "Semitones Between Notes Calculator",
  description:
    "Return the signed semitone distance between two scientific-pitch notes such as C4 and E4.",
  inputs: [
    {
      description: "Starting note, e.g. C4.",
      id: "fromNote",
      label: "From note",
      kind: "string",
    },
    {
      description: "Target note, e.g. E4.",
      id: "toNote",
      label: "To note",
      kind: "string",
    },
  ],
  outputs: [
    {
      description: "Semitones from the starting note to the target note.",
      id: "semitones",
      label: "Semitones",
      kind: "integer",
    },
  ],
  calculate: (input) => {
    const toNote = input.toNote as string;
    const fromMidi = toMidi(input.fromNote as string);
    if (!NOTE_PATTERN.test(toNote.trim()))
      simpleError(
        "toNote",
        "Notes must look like C4, F#3, or Bb2.",
        "invalid_note",
      );
    return { semitones: toMidi(toNote) - fromMidi };
  },
});
export const runSemitonesBetween = semitonesBetweenTool.execute;
export default semitonesBetweenTool;

export type SemitonesBetweenInput = {
  readonly fromNote: string;
  readonly toNote: string;
};

export type SemitonesBetweenOutput = {
  readonly semitones: number;
};

export const semitonesBetweenExample = {
  input: { fromNote: "C4", toNote: "E4" },
  output: { semitones: 4 },
} satisfies ToolExample<SemitonesBetweenInput, SemitonesBetweenOutput>;
