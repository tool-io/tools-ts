import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, pitch, clefBottom } from "../shared.js";
export type Input = Readonly<{
  readonly clef: string;
  readonly signedStepsFromBottomStaffLine: number;
}>;
export type Output = Readonly<{
  readonly naturalScientificNote: string;
  readonly diatonicPitchIndex: number;
}>;
const inputFields = [
  { id: "clef", label: "Clef", kind: "string" },
  {
    id: "signedStepsFromBottomStaffLine",
    label: "Signed steps from bottom staff line",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.signedStepsFromBottomStaffLine) ||
    Math.abs(input.signedStepsFromBottomStaffLine) > 28
  )
    simpleError("position", "Signed line/space steps within ±28 required.");
  const index = clefBottom(input.clef) + input.signedStepsFromBottomStaffLine,
    l = ((index % 7) + 7) % 7,
    o = Math.floor(index / 7),
    note = "CDEFGAB"[l] + o;
  pitch(note, true);
  return { naturalScientificNote: note, diatonicPitchIndex: index };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  clef: "treble",
  signedStepsFromBottomStaffLine: 3,
} satisfies Input;
export const exampleOutput = {
  naturalScientificNote: "A4",
  diatonicPitchIndex: 33,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/staff-position-to-diatonic-step",
  title: "Staff Position to Diatonic Step",
  description:
    "Resolve signed line/space steps from conventional five-line staff bottom under treble/bass/alto/tenor clef, yielding natural letter/octave; accidentals/key signature not inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "naturalScientificNote",
      label: "Natural scientific note",
      kind: "string",
    },
    { id: "diatonicPitchIndex", label: "Diatonic pitch index", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      clef: value.clef as string,
      signedStepsFromBottomStaffLine:
        value.signedStepsFromBottomStaffLine as number,
    }),
});
export const run = tool.execute;
export default tool;
