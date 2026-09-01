import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  pitch,
  key,
  spellingDegree,
} from "../shared.js";
export type Input = Readonly<{
  readonly majorTonic: string;
  readonly spelledChordNotes: readonly string[];
}>;
export type Output = Readonly<{
  readonly augmentedSixthType: string;
  readonly augmentedSixthSpellingPresent: boolean;
}>;
const inputFields = [
  { id: "majorTonic", label: "Major tonic", kind: "string" },
  { id: "spelledChordNotes", label: "Spelled chord notes", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const tonic = key(input.majorTonic);
  if (input.spelledChordNotes.length < 3 || input.spelledChordNotes.length > 16)
    simpleError("notes", "Bounded 3–16 spelled pitch-class tones required.");
  const set = [
      ...new Set(
        input.spelledChordNotes.map((s) => {
          const d = spellingDegree(tonic, key(s));
          return `${d.degree}:${d.alteration}`;
        }),
      ),
    ].sort(),
    base = ["1:0", "4:1", "6:-1"],
    present = base.every((v) => set.includes(v)),
    equal = (x: string[]) =>
      x.length === set.length && x.sort().every((v, i) => v === set[i]),
    type = equal(base)
      ? "Italian"
      : equal([...base, "2:0"])
        ? "French"
        : equal([...base, "3:-1"])
          ? "German"
          : "unrecognized";
  return { augmentedSixthType: type, augmentedSixthSpellingPresent: present };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  majorTonic: "C",
  spelledChordNotes: ["Ab", "C", "F#"],
} satisfies Input;
export const exampleOutput = {
  augmentedSixthType: "Italian",
  augmentedSixthSpellingPresent: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/augmented-sixth-type-classifier",
  title: "Augmented Sixth Type Classifier (It/Fr/Ger)",
  description:
    "Classify exact spelled ♭6–1–♯4 Italian/French/German collections relative to major key, preserving distinction from enharmonic dominant seventh; no voice-leading resolution guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "augmentedSixthType", label: "Augmented sixth type", kind: "string" },
    {
      id: "augmentedSixthSpellingPresent",
      label: "Augmented sixth spelling present",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      majorTonic: value.majorTonic as string,
      spelledChordNotes: value.spelledChordNotes as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
