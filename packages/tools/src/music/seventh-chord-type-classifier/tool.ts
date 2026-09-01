import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pc, seventhQuality } from "../shared.js";
export type Input = Readonly<{
  readonly rootRelativeSeventhSemitones: readonly number[];
}>;
export type Output = Readonly<{
  readonly seventhQualityLabel: string;
  readonly seventhPitchClass: number;
}>;
const inputFields = [
  {
    id: "rootRelativeSeventhSemitones",
    label: "Root relative seventh semitones",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const q = seventhQuality(input.rootRelativeSeventhSemitones),
    set = [...new Set(input.rootRelativeSeventhSemitones.map(pc))].sort(
      (a, b) => a - b,
    );
  return {
    seventhQualityLabel: q,
    seventhPitchClass: q === "unrecognized" ? -1 : set[3],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rootRelativeSeventhSemitones: [0, 3, 6, 10],
} satisfies Input;
export const exampleOutput = {
  seventhQualityLabel: "half-diminished",
  seventhPitchClass: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/seventh-chord-type-classifier",
  title: "Seventh Chord Type Classifier",
  description:
    "Classify complete root-relative seventh sets (including fully/half diminished and minor-major) independently of triads, collapsing octave doublings; incomplete/extra collections remain unrecognized.",
  inputs: inputFields,
  outputs: [
    {
      id: "seventhQualityLabel",
      label: "Seventh quality label",
      kind: "string",
    },
    { id: "seventhPitchClass", label: "Seventh pitch class", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      rootRelativeSeventhSemitones:
        value.rootRelativeSeventhSemitones as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
