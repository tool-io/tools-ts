import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pitch, namePitch } from "../shared.js";
export type Input = Readonly<{ readonly noteSpelling: string }>;
export type Output = Readonly<{
  readonly normalizedAccidentalSpelling: string;
  readonly signedAccidentalSemitones: number;
  readonly usesDoubleAccidental: boolean;
}>;
const inputFields = [
  { id: "noteSpelling", label: "Note spelling", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const p = pitch(input.noteSpelling);
  return {
    normalizedAccidentalSpelling: namePitch(p),
    signedAccidentalSemitones: p.accidental,
    usesDoubleAccidental: Math.abs(p.accidental) === 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { noteSpelling: "Fx4" } satisfies Input;
export const exampleOutput = {
  normalizedAccidentalSpelling: "F##4",
  signedAccidentalSemitones: 2,
  usesDoubleAccidental: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/accidental-double-sharp-flat-checker",
  title: "Double Sharp/Flat Notation Check",
  description:
    "Parse exact note spelling to normalize x/Unicode accidentals and identify actual double sharp/flat while retaining written octave; does not equate double accidentals with full-step note renaming.",
  inputs: inputFields,
  outputs: [
    {
      id: "normalizedAccidentalSpelling",
      label: "Normalized accidental spelling",
      kind: "string",
    },
    {
      id: "signedAccidentalSemitones",
      label: "Signed accidental semitones",
      kind: "number",
    },
    {
      id: "usesDoubleAccidental",
      label: "Uses double accidental",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({ noteSpelling: value.noteSpelling as string }),
});
export const run = tool.execute;
export default tool;
