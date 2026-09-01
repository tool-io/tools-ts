import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  identifier,
  lexemes,
  lexicon,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly observedText: string;
  readonly callerProfileLabels: readonly string[];
  readonly callerStopwordProfiles: readonly string[];
}>;
export type Output = Readonly<{
  readonly profileMatchedTokenCounts: readonly number[];
  readonly profileObservedTokenShares: readonly number[];
  readonly tiedBestProfileLabels: readonly string[];
  readonly observedLexicalTokenCount: number;
  readonly positiveProfileEvidenceAvailable: boolean;
}>;
const inputFields = [
  { id: "observedText", label: "Observed text", kind: "string" },
  {
    id: "callerProfileLabels",
    label: "Caller profile labels",
    kind: "stringList",
  },
  {
    id: "callerStopwordProfiles",
    label: "Caller stopword profiles",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerProfileLabels,
    input.callerStopwordProfiles,
    "callerProfileLabels",
  );
  if (
    new Set(input.callerProfileLabels).size !== input.callerProfileLabels.length
  )
    simpleError("profiles", "Distinct caller profile labels required.");
  input.callerProfileLabels.forEach(identifier);
  const words = lexemes(input.observedText),
    dictionaries = input.callerStopwordProfiles.map(lexicon),
    counts = dictionaries.map((d) => words.filter((w) => d.has(w)).length),
    best = Math.max(...counts),
    n = words.length;
  return {
    profileMatchedTokenCounts: counts,
    profileObservedTokenShares: counts.map((v) => (n ? v / n : 0)),
    tiedBestProfileLabels:
      best > 0
        ? input.callerProfileLabels.filter((_, i) => counts[i] === best)
        : [],
    observedLexicalTokenCount: n,
    positiveProfileEvidenceAvailable: best > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedText: "the and le",
  callerProfileLabels: ["English", "French"],
  callerStopwordProfiles: ["the and", "le et"],
} satisfies Input;
export const exampleOutput = {
  profileMatchedTokenCounts: [2, 1],
  profileObservedTokenShares: [0.6666666666666666, 0.3333333333333333],
  tiedBestProfileLabels: ["English"],
  observedLexicalTokenCount: 3,
  positiveProfileEvidenceAvailable: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/stopword-based-language-guess-score",
  title: "Stopword-Based Language Guess Score",
  description:
    "Score bounded caller multilingual stopword profiles against actual NFC lexical tokens with tied winners and absent evidence retained; unlike existing fixed English whitespace counter, no confidence calibration or definitive language identification.",
  inputs: inputFields,
  outputs: [
    {
      id: "profileMatchedTokenCounts",
      label: "Profile matched token counts",
      kind: "numberList",
    },
    {
      id: "profileObservedTokenShares",
      label: "Profile observed token shares",
      kind: "numberList",
    },
    {
      id: "tiedBestProfileLabels",
      label: "Tied best profile labels",
      kind: "stringList",
    },
    {
      id: "observedLexicalTokenCount",
      label: "Observed lexical token count",
      kind: "number",
    },
    {
      id: "positiveProfileEvidenceAvailable",
      label: "Positive profile evidence available",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedText: value.observedText as string,
      callerProfileLabels: value.callerProfileLabels as readonly string[],
      callerStopwordProfiles: value.callerStopwordProfiles as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
