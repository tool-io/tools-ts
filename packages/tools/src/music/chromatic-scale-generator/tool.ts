import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, key, pc } from "../shared.js";
export type Input = Readonly<{
  readonly tonic: string;
  readonly accidentalPreference: string;
}>;
export type Output = Readonly<{
  readonly chromaticPitchNames: readonly string[];
  readonly chromaticPitchClasses: readonly number[];
}>;
const inputFields = [
  { id: "tonic", label: "Tonic", kind: "string" },
  {
    id: "accidentalPreference",
    label: "Accidental preference",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const t = key(input.tonic);
  if (!["sharp", "flat"].includes(input.accidentalPreference))
    simpleError("preference", "sharp/flat required.");
  const names =
    input.accidentalPreference === "sharp"
      ? ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
      : ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  const pcs = Array.from({ length: 12 }, (_, i) => pc(t.pitchClass + i));
  return {
    chromaticPitchNames: pcs.map((v) => names[v]),
    chromaticPitchClasses: pcs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  tonic: "D",
  accidentalPreference: "flat",
} satisfies Input;
export const exampleOutput = {
  chromaticPitchNames: [
    "D",
    "Eb",
    "E",
    "F",
    "Gb",
    "G",
    "Ab",
    "A",
    "Bb",
    "B",
    "C",
    "Db",
  ],
  chromaticPitchClasses: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/chromatic-scale-generator",
  title: "Chromatic Scale Generator",
  description:
    "Generate a full tonic-rotated 12-class chromatic collection with explicit sharp/flat display convention; canonical names need not retain noncanonical input spelling.",
  inputs: inputFields,
  outputs: [
    {
      id: "chromaticPitchNames",
      label: "Chromatic pitch names",
      kind: "stringList",
    },
    {
      id: "chromaticPitchClasses",
      label: "Chromatic pitch classes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      tonic: value.tonic as string,
      accidentalPreference: value.accidentalPreference as string,
    }),
});
export const run = tool.execute;
export default tool;
