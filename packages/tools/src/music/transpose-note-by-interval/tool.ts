import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  pitch,
  namePitch,
  stepSpell,
} from "../shared.js";
export type Input = Readonly<{
  readonly scientificNote: string;
  readonly signedDiatonicSteps: number;
  readonly signedChromaticSemitones: number;
}>;
export type Output = Readonly<{
  readonly transposedScientificNote: string;
  readonly transposedMidiNote: number;
}>;
const inputFields = [
  { id: "scientificNote", label: "Scientific note", kind: "string" },
  { id: "signedDiatonicSteps", label: "Signed diatonic steps", kind: "number" },
  {
    id: "signedChromaticSemitones",
    label: "Signed chromatic semitones",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const p = stepSpell(
    pitch(input.scientificNote, true),
    input.signedDiatonicSteps,
    input.signedChromaticSemitones,
  );
  return {
    transposedScientificNote: namePitch(p),
    transposedMidiNote: p.absolute,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  scientificNote: "C4",
  signedDiatonicSteps: 1,
  signedChromaticSemitones: 3,
} satisfies Input;
export const exampleOutput = {
  transposedScientificNote: "D#4",
  transposedMidiNote: 63,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/transpose-note-by-interval",
  title: "Transpose Note By Interval",
  description:
    "Transpose by separate signed diatonic/chromatic displacement to preserve intended interval spelling, unlike simple MIDI addition/capo offset; output must be MIDI-range and at most double accidental.",
  inputs: inputFields,
  outputs: [
    {
      id: "transposedScientificNote",
      label: "Transposed scientific note",
      kind: "string",
    },
    { id: "transposedMidiNote", label: "Transposed midi note", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      scientificNote: value.scientificNote as string,
      signedDiatonicSteps: value.signedDiatonicSteps as number,
      signedChromaticSemitones: value.signedChromaticSemitones as number,
    }),
});
export const run = tool.execute;
export default tool;
