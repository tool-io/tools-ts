import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pc, tertianQuality } from "../shared.js";
export type Input = Readonly<{
  readonly rootRelativeSemitoneOffsets: readonly number[];
}>;
export type Output = Readonly<{
  readonly tertianTriadQuality: string;
  readonly distinctPitchClassCount: number;
}>;
const inputFields = [
  {
    id: "rootRelativeSemitoneOffsets",
    label: "Root relative semitone offsets",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const quality = tertianQuality(input.rootRelativeSemitoneOffsets);
  return {
    tertianTriadQuality: quality,
    distinctPitchClassCount: new Set(input.rootRelativeSemitoneOffsets.map(pc))
      .size,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rootRelativeSemitoneOffsets: [0, 4, 7, 12],
} satisfies Input;
export const exampleOutput = {
  tertianTriadQuality: "major",
  distinctPitchClassCount: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/chord-quality-from-intervals-classifier",
  title: "Chord Quality From Intervals Classifier",
  description:
    "Classify exact root-relative tertian triad pitch-class sets with octave duplicates collapsed; returns unrecognized for extras/missing tones, not root inference or seventh classification.",
  inputs: inputFields,
  outputs: [
    {
      id: "tertianTriadQuality",
      label: "Tertian triad quality",
      kind: "string",
    },
    {
      id: "distinctPitchClassCount",
      label: "Distinct pitch class count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      rootRelativeSemitoneOffsets:
        value.rootRelativeSemitoneOffsets as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
