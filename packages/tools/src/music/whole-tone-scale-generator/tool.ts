import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, key, namePitch, stepSpell } from "../shared.js";
export type Input = Readonly<{ readonly tonic: string }>;
export type Output = Readonly<{
  readonly spelledWholeToneNotes: readonly string[];
  readonly wholeTonePitchClasses: readonly number[];
}>;
const inputFields = [
  { id: "tonic", label: "Tonic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const t = key(input.tonic),
    notes = Array.from({ length: 6 }, (_, i) => stepSpell(t, i, 2 * i));
  return {
    spelledWholeToneNotes: notes.map(namePitch),
    wholeTonePitchClasses: notes.map((p) => p.pitchClass),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { tonic: "C" } satisfies Input;
export const exampleOutput = {
  spelledWholeToneNotes: ["C", "D", "E", "F#", "G#", "A#"],
  wholeTonePitchClasses: [0, 2, 4, 6, 8, 10],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/whole-tone-scale-generator",
  title: "Whole-Tone Scale Generator",
  description:
    "Generate six equal whole steps with ascending distinct letter spelling from tonic, before octave return; spellings beyond double accidentals are rejected, no static scale reference.",
  inputs: inputFields,
  outputs: [
    {
      id: "spelledWholeToneNotes",
      label: "Spelled whole tone notes",
      kind: "stringList",
    },
    {
      id: "wholeTonePitchClasses",
      label: "Whole tone pitch classes",
      kind: "numberList",
    },
  ],
  calculate: (value) => calculate({ tonic: value.tonic as string }),
});
export const run = tool.execute;
export default tool;
