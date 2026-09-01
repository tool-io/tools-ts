import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pitch, namePitch } from "../shared.js";
export type Input = Readonly<{ readonly scientificNote: string }>;
export type Output = Readonly<{
  readonly integerMidiNote: number;
  readonly normalizedInputSpelling: string;
  readonly enharmonicPitchClass: number;
}>;
const inputFields = [
  { id: "scientificNote", label: "Scientific note", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const p = pitch(input.scientificNote, true);
  return {
    integerMidiNote: p.absolute,
    normalizedInputSpelling: namePitch(p),
    enharmonicPitchClass: p.pitchClass,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { scientificNote: "Cb4" } satisfies Input;
export const exampleOutput = {
  integerMidiNote: 59,
  normalizedInputSpelling: "Cb4",
  enharmonicPitchClass: 11,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/note-name-to-midi",
  title: "Note Name to MIDI Converter",
  description:
    "Parse exact scientific A–G pitch with optional double accidental and octave, resolving octave-crossing accidentals into integer MIDI 0–127; no frequency rounding or loose text parsing.",
  inputs: inputFields,
  outputs: [
    { id: "integerMidiNote", label: "Integer midi note", kind: "number" },
    {
      id: "normalizedInputSpelling",
      label: "Normalized input spelling",
      kind: "string",
    },
    {
      id: "enharmonicPitchClass",
      label: "Enharmonic pitch class",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ scientificNote: value.scientificNote as string }),
});
export const run = tool.execute;
export default tool;
