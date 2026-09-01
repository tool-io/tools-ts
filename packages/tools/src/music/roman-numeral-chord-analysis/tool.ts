import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, key, spellingDegree } from "../shared.js";
export type Input = Readonly<{
  readonly majorTonic: string;
  readonly chordRoot: string;
  readonly chordQuality: string;
}>;
export type Output = Readonly<{
  readonly romanAnalysis: string;
  readonly diatonicRootDegree: number;
  readonly rootChromaticAlteration: number;
}>;
const inputFields = [
  { id: "majorTonic", label: "Major tonic", kind: "string" },
  { id: "chordRoot", label: "Chord root", kind: "string" },
  { id: "chordQuality", label: "Chord quality", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const t = key(input.majorTonic),
    r = key(input.chordRoot),
    d = spellingDegree(t, r);
  if (
    Math.abs(d.alteration) > 2 ||
    ![
      "major",
      "minor",
      "diminished",
      "augmented",
      "major-seventh",
      "dominant-seventh",
      "minor-seventh",
      "half-diminished",
      "diminished-seventh",
    ].includes(input.chordQuality)
  )
    simpleError(
      "quality",
      "Supported tertian quality and up to double root alteration required.",
    );
  const names = ["I", "II", "III", "IV", "V", "VI", "VII"],
    q = input.chordQuality,
    minor = [
      "minor",
      "diminished",
      "minor-seventh",
      "half-diminished",
      "diminished-seventh",
    ].includes(q),
    num = minor ? names[d.degree - 1].toLowerCase() : names[d.degree - 1],
    suffix = q.includes("diminished")
      ? q === "half-diminished"
        ? "ø"
        : "o"
      : q === "augmented"
        ? "+"
        : "",
    seventh =
      q === "major-seventh"
        ? "maj7"
        : q.includes("seventh") || q === "half-diminished"
          ? "7"
          : "",
    acc =
      d.alteration < 0 ? "b".repeat(-d.alteration) : "#".repeat(d.alteration);
  return {
    romanAnalysis: acc + num + suffix + seventh,
    diatonicRootDegree: d.degree,
    rootChromaticAlteration: d.alteration,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  majorTonic: "C",
  chordRoot: "Eb",
  chordQuality: "major",
} satisfies Input;
export const exampleOutput = {
  romanAnalysis: "bIII",
  diatonicRootDegree: 3,
  rootChromaticAlteration: -1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/roman-numeral-chord-analysis",
  title: "Roman Numeral Chord Analysis",
  description:
    "Analyze caller spelled root and explicit tertian quality relative to major tonic, retaining diatonic enharmonic distinction and seventh suffix; no harmonic-function inference from audio or inversion.",
  inputs: inputFields,
  outputs: [
    { id: "romanAnalysis", label: "Roman analysis", kind: "string" },
    { id: "diatonicRootDegree", label: "Diatonic root degree", kind: "number" },
    {
      id: "rootChromaticAlteration",
      label: "Root chromatic alteration",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      majorTonic: value.majorTonic as string,
      chordRoot: value.chordRoot as string,
      chordQuality: value.chordQuality as string,
    }),
});
export const run = tool.execute;
export default tool;
