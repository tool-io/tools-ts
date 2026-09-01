import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  pc,
  tertianQuality,
  classifySet,
} from "../shared.js";
export type Input = Readonly<{
  readonly rootRelativeChordSemitones: readonly number[];
}>;
export type Output = Readonly<{
  readonly suspensionOrTriadQuality: string;
  readonly thirdPresent: boolean;
}>;
const inputFields = [
  {
    id: "rootRelativeChordSemitones",
    label: "Root relative chord semitones",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const set = classifySet(input.rootRelativeChordSemitones, [
      [0, 2, 7],
      [0, 5, 7],
    ]),
    q =
      set === 0
        ? "sus2"
        : set === 1
          ? "sus4"
          : tertianQuality(input.rootRelativeChordSemitones);
  return {
    suspensionOrTriadQuality: q,
    thirdPresent: input.rootRelativeChordSemitones.some((v) =>
      [3, 4].includes(pc(v)),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rootRelativeChordSemitones: [0, 2, 7],
} satisfies Input;
export const exampleOutput = {
  suspensionOrTriadQuality: "sus2",
  thirdPresent: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/sus-chord-vs-triad-classifier",
  title: "Sus Chord vs Triad Classifier",
  description:
    "Distinguish exact third-replacing sus2/sus4 sets from tertian triads and mixed/added-tone ambiguity; presence of a second/fourth alone does not imply suspension.",
  inputs: inputFields,
  outputs: [
    {
      id: "suspensionOrTriadQuality",
      label: "Suspension or triad quality",
      kind: "string",
    },
    { id: "thirdPresent", label: "Third present", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      rootRelativeChordSemitones:
        value.rootRelativeChordSemitones as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
