import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch-shared.js";
export type Input = Readonly<{
  readonly callerAnnotatedSyllablePatterns: readonly string[];
}>;
export type Output = Readonly<{
  readonly distinctObservedSyllablePatterns: readonly string[];
  readonly onsetConsonantCounts: readonly number[];
  readonly codaConsonantCounts: readonly number[];
  readonly openSyllableFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "callerAnnotatedSyllablePatterns",
    label: "Caller annotated syllable patterns",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.callerAnnotatedSyllablePatterns.length ||
    input.callerAnnotatedSyllablePatterns.some(
      (s) => s.length > 32 || !/^C*V+C*$(?![\s\S])/.test(s),
    )
  )
    simpleError(
      "pattern",
      "Explicit single-nucleus C*V+C* annotated syllable tokens required.",
    );
  const onset = input.callerAnnotatedSyllablePatterns.map((s) =>
      s.indexOf("V"),
    ),
    coda = input.callerAnnotatedSyllablePatterns.map(
      (s) => s.length - 1 - s.lastIndexOf("V"),
    );
  return {
    distinctObservedSyllablePatterns: [
      ...new Set(input.callerAnnotatedSyllablePatterns),
    ],
    onsetConsonantCounts: onset,
    codaConsonantCounts: coda,
    openSyllableFlags: coda.map((v) => (v === 0 ? 1 : 0)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAnnotatedSyllablePatterns: ["CV", "CVC", "CCV"],
} satisfies Input;
export const exampleOutput = {
  distinctObservedSyllablePatterns: ["CV", "CVC", "CCV"],
  onsetConsonantCounts: [1, 1, 2],
  codaConsonantCounts: [0, 1, 0],
  openSyllableFlags: [1, 0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/syllable-structure-type-lookup-cv-cvc",
  title: "Syllable Structure Type Lookup (CV/CVC)",
  description:
    "Audit explicitly annotated observed syllable onset/nucleus/coda patterns, retaining diphthong VV nuclei and actual inventory; no phonetic segmentation or language-wide permissible template inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "distinctObservedSyllablePatterns",
      label: "Distinct observed syllable patterns",
      kind: "stringList",
    },
    {
      id: "onsetConsonantCounts",
      label: "Onset consonant counts",
      kind: "numberList",
    },
    {
      id: "codaConsonantCounts",
      label: "Coda consonant counts",
      kind: "numberList",
    },
    {
      id: "openSyllableFlags",
      label: "Open syllable flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAnnotatedSyllablePatterns:
        value.callerAnnotatedSyllablePatterns as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
