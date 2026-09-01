import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, midi, pc } from "../shared.js";
export type Input = Readonly<{
  readonly midiNote: number;
  readonly accidentalPreference: string;
}>;
export type Output = Readonly<{
  readonly scientificNoteName: string;
  readonly pitchClass: number;
}>;
const inputFields = [
  { id: "midiNote", label: "Midi note", kind: "number" },
  {
    id: "accidentalPreference",
    label: "Accidental preference",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  midi(input.midiNote);
  if (!["sharp", "flat"].includes(input.accidentalPreference))
    simpleError("preference", "sharp/flat preference required.");
  const names =
    input.accidentalPreference === "sharp"
      ? ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
      : ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  return {
    scientificNoteName:
      names[pc(input.midiNote)] + (Math.floor(input.midiNote / 12) - 1),
    pitchClass: pc(input.midiNote),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  midiNote: 61,
  accidentalPreference: "sharp",
} satisfies Input;
export const exampleOutput = {
  scientificNoteName: "C#4",
  pitchClass: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/midi-to-note-name",
  title: "MIDI to Note Name Converter",
  description:
    "Convert integer MIDI 0–127 to complete scientific note name under explicit enharmonic preference (middle C=C4); unlike octave-only lookup, names and accidentals are included.",
  inputs: inputFields,
  outputs: [
    { id: "scientificNoteName", label: "Scientific note name", kind: "string" },
    { id: "pitchClass", label: "Pitch class", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      midiNote: value.midiNote as number,
      accidentalPreference: value.accidentalPreference as string,
    }),
});
export const run = tool.execute;
export default tool;
