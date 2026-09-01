import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  key,
  spellingDegree,
  chordIntervals,
} from "../shared.js";
export type Input = Readonly<{
  readonly majorTonic: string;
  readonly observedChordRoot: string;
  readonly observedChordQuality: string;
}>;
export type Output = Readonly<{
  readonly matchesBorrowedFlatSevenMajor: boolean;
  readonly observedSpelledRootDegree: number;
  readonly observedRootAlteration: number;
}>;
const inputFields = [
  { id: "majorTonic", label: "Major tonic", kind: "string" },
  { id: "observedChordRoot", label: "Observed chord root", kind: "string" },
  {
    id: "observedChordQuality",
    label: "Observed chord quality",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const d = spellingDegree(key(input.majorTonic), key(input.observedChordRoot));
  chordIntervals(input.observedChordQuality);
  return {
    matchesBorrowedFlatSevenMajor:
      d.degree === 7 &&
      d.alteration === -1 &&
      input.observedChordQuality === "major",
    observedSpelledRootDegree: d.degree,
    observedRootAlteration: d.alteration,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  majorTonic: "C",
  observedChordRoot: "Bb",
  observedChordQuality: "major",
} satisfies Input;
export const exampleOutput = {
  matchesBorrowedFlatSevenMajor: true,
  observedSpelledRootDegree: 7,
  observedRootAlteration: -1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/borrowed-flat-seven-checker",
  title: "Borrowed ♭VII (Mixolydian) Check",
  description:
    "Check explicitly spelled lowered-seventh major triad relative to major tonic (Mixolydian collection marker), not enharmonic A# or proof of borrowed harmonic intent.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchesBorrowedFlatSevenMajor",
      label: "Matches borrowed flat seven major",
      kind: "boolean",
    },
    {
      id: "observedSpelledRootDegree",
      label: "Observed spelled root degree",
      kind: "number",
    },
    {
      id: "observedRootAlteration",
      label: "Observed root alteration",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      majorTonic: value.majorTonic as string,
      observedChordRoot: value.observedChordRoot as string,
      observedChordQuality: value.observedChordQuality as string,
    }),
});
export const run = tool.execute;
export default tool;
