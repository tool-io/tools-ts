import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, pc } from "../shared.js";
export type Input = Readonly<{
  readonly majorScaleDegree: number;
  readonly chromaticAlteration: number;
}>;
export type Output = Readonly<{
  readonly movableDoSyllable: string;
  readonly rootRelativeSolfegeSemitones: number;
}>;
const inputFields = [
  { id: "majorScaleDegree", label: "Major scale degree", kind: "number" },
  { id: "chromaticAlteration", label: "Chromatic alteration", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const d = bounded(input.majorScaleDegree, "degree", 1, 7);
  if (![-1, 0, 1].includes(input.chromaticAlteration))
    simpleError("alteration", "−1/0/+1 alteration required.");
  const names =
      input.chromaticAlteration === 0
        ? ["do", "re", "mi", "fa", "sol", "la", "ti"]
        : input.chromaticAlteration === 1
          ? ["di", "ri", "", "fi", "si", "li", ""]
          : ["", "ra", "me", "", "se", "le", "te"],
    s = names[d - 1];
  if (!s)
    simpleError(
      "alteration",
      "This convention has no distinct syllable for that altered degree.",
    );
  return {
    movableDoSyllable: s,
    rootRelativeSolfegeSemitones: pc(
      [0, 2, 4, 5, 7, 9, 11][d - 1] + input.chromaticAlteration,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  majorScaleDegree: 4,
  chromaticAlteration: 1,
} satisfies Input;
export const exampleOutput = {
  movableDoSyllable: "fi",
  rootRelativeSolfegeSemitones: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/solfege-syllable-from-degree",
  title: "Solfege Syllable From Degree",
  description:
    "Resolve movable-do major chromatic syllables under explicit degree/alteration with unsupported enharmonic syllables rejected; not fixed-do or universal minor solfege convention.",
  inputs: inputFields,
  outputs: [
    { id: "movableDoSyllable", label: "Movable do syllable", kind: "string" },
    {
      id: "rootRelativeSolfegeSemitones",
      label: "Root relative solfege semitones",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      majorScaleDegree: value.majorScaleDegree as number,
      chromaticAlteration: value.chromaticAlteration as number,
    }),
});
export const run = tool.execute;
export default tool;
