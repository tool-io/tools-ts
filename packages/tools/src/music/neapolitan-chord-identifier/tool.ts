import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  key,
  stepSpell,
  spellingDegree,
  chordIntervals,
} from "../shared.js";
export type Input = Readonly<{
  readonly majorTonic: string;
  readonly observedChordRoot: string;
  readonly observedChordQuality: string;
  readonly observedBassNote: string;
}>;
export type Output = Readonly<{
  readonly matchesNeapolitanMajorTriad: boolean;
  readonly firstInversionObserved: boolean;
}>;
const inputFields = [
  { id: "majorTonic", label: "Major tonic", kind: "string" },
  { id: "observedChordRoot", label: "Observed chord root", kind: "string" },
  {
    id: "observedChordQuality",
    label: "Observed chord quality",
    kind: "string",
  },
  { id: "observedBassNote", label: "Observed bass note", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const t = key(input.majorTonic),
    r = key(input.observedChordRoot),
    b = key(input.observedBassNote),
    d = spellingDegree(t, r);
  chordIntervals(input.observedChordQuality);
  const match =
      d.degree === 2 &&
      d.alteration === -1 &&
      input.observedChordQuality === "major",
    third = stepSpell(r, 2, 4);
  return {
    matchesNeapolitanMajorTriad: match,
    firstInversionObserved:
      match && b.pitchClass === third.pitchClass && b.letter === third.letter,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  majorTonic: "C",
  observedChordRoot: "Db",
  observedChordQuality: "major",
  observedBassNote: "F",
} satisfies Input;
export const exampleOutput = {
  matchesNeapolitanMajorTriad: true,
  firstInversionObserved: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/neapolitan-chord-identifier",
  title: "Neapolitan ♭II Chord Identifier",
  description:
    "Identify spelled lowered-second major triad and separately observed traditional first inversion; does not require inversion for chord identity or claim chromatic pitch-class similarity proves Neapolitan function.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchesNeapolitanMajorTriad",
      label: "Matches neapolitan major triad",
      kind: "boolean",
    },
    {
      id: "firstInversionObserved",
      label: "First inversion observed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      majorTonic: value.majorTonic as string,
      observedChordRoot: value.observedChordRoot as string,
      observedChordQuality: value.observedChordQuality as string,
      observedBassNote: value.observedBassNote as string,
    }),
});
export const run = tool.execute;
export default tool;
