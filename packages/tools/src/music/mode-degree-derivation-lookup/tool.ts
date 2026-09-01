import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  key,
  namePitch,
  stepSpell,
} from "../shared.js";
export type Input = Readonly<{
  readonly parentMajorTonic: string;
  readonly modeDegree: number;
}>;
export type Output = Readonly<{
  readonly derivedModeName: string;
  readonly derivedModeTonic: string;
  readonly derivedModeNotes: readonly string[];
  readonly modeStepSemitones: readonly number[];
}>;
const inputFields = [
  { id: "parentMajorTonic", label: "Parent major tonic", kind: "string" },
  { id: "modeDegree", label: "Mode degree", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const tonic = key(input.parentMajorTonic),
    d = bounded(input.modeDegree, "degree", 1, 7),
    major = [0, 2, 4, 5, 7, 9, 11],
    notes = major.map((s, i) => namePitch(stepSpell(tonic, i, s))),
    steps = [2, 2, 1, 2, 2, 2, 1];
  return {
    derivedModeName: [
      "ionian",
      "dorian",
      "phrygian",
      "lydian",
      "mixolydian",
      "aeolian",
      "locrian",
    ][d - 1],
    derivedModeTonic: notes[d - 1],
    derivedModeNotes: Array.from(
      { length: 7 },
      (_, i) => notes[(d - 1 + i) % 7],
    ),
    modeStepSemitones: Array.from(
      { length: 7 },
      (_, i) => steps[(d - 1 + i) % 7],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  parentMajorTonic: "D",
  modeDegree: 2,
} satisfies Input;
export const exampleOutput = {
  derivedModeName: "dorian",
  derivedModeTonic: "E",
  derivedModeNotes: ["E", "F#", "G", "A", "B", "C#", "D"],
  modeStepSemitones: [2, 1, 2, 2, 2, 1, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/mode-degree-derivation-lookup",
  title: "Mode From Major Scale Degree Lookup",
  description:
    "Derive concrete spelled modal notes, tonic and rotated interval steps from caller parent major key/degree, not a static mode-name-only reference.",
  inputs: inputFields,
  outputs: [
    { id: "derivedModeName", label: "Derived mode name", kind: "string" },
    { id: "derivedModeTonic", label: "Derived mode tonic", kind: "string" },
    { id: "derivedModeNotes", label: "Derived mode notes", kind: "stringList" },
    {
      id: "modeStepSemitones",
      label: "Mode step semitones",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      parentMajorTonic: value.parentMajorTonic as string,
      modeDegree: value.modeDegree as number,
    }),
});
export const run = tool.execute;
export default tool;
