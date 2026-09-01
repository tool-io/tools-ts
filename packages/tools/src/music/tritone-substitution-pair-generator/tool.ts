import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, key, namePitch, pc } from "../shared.js";
export type Input = Readonly<{
  readonly dominantSeventhRoot: string;
  readonly substitutionRootPreference: string;
}>;
export type Output = Readonly<{
  readonly originalDominantSymbol: string;
  readonly tritoneSubstituteSymbol: string;
  readonly commonGuideTonePitchClasses: readonly number[];
}>;
const inputFields = [
  { id: "dominantSeventhRoot", label: "Dominant seventh root", kind: "string" },
  {
    id: "substitutionRootPreference",
    label: "Substitution root preference",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const t = key(input.dominantSeventhRoot);
  if (!["flat", "sharp"].includes(input.substitutionRootPreference))
    simpleError("preference", "flat/sharp display preference required.");
  const names =
      input.substitutionRootPreference === "flat"
        ? ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
        : ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
    sub = pc(t.pitchClass + 6);
  return {
    originalDominantSymbol: namePitch(t) + "7",
    tritoneSubstituteSymbol: names[sub] + "7",
    commonGuideTonePitchClasses: [
      pc(t.pitchClass + 4),
      pc(t.pitchClass + 10),
    ].sort((a, b) => a - b),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dominantSeventhRoot: "G",
  substitutionRootPreference: "flat",
} satisfies Input;
export const exampleOutput = {
  originalDominantSymbol: "G7",
  tritoneSubstituteSymbol: "Db7",
  commonGuideTonePitchClasses: [5, 11],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/tritone-substitution-pair-generator",
  title: "Tritone Substitution Pair Generator",
  description:
    "Generate dominant-seventh tritone-substitute pair with shared third/seventh sounding guide tones, under explicit substitute enharmonic display; not promise of musical interchangeability or generic +6 transposition.",
  inputs: inputFields,
  outputs: [
    {
      id: "originalDominantSymbol",
      label: "Original dominant symbol",
      kind: "string",
    },
    {
      id: "tritoneSubstituteSymbol",
      label: "Tritone substitute symbol",
      kind: "string",
    },
    {
      id: "commonGuideTonePitchClasses",
      label: "Common guide tone pitch classes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      dominantSeventhRoot: value.dominantSeventhRoot as string,
      substitutionRootPreference: value.substitutionRootPreference as string,
    }),
});
export const run = tool.execute;
export default tool;
