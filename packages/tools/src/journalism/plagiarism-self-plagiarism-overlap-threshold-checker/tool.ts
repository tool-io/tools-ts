import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  wordTokens,
  ngrams,
  fraction,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly candidateCopy: string;
  readonly referenceCopy: string;
  readonly ngramWordCount: number;
  readonly callerOverlapReviewThresholdFraction: number;
}>;
export type Output = Readonly<{
  readonly uniqueCandidateNgramCount: number;
  readonly sharedNgramCount: number;
  readonly candidateNgramContainmentFraction: number;
  readonly callerOverlapReviewFlag: boolean;
}>;
const inputFields = [
  { id: "candidateCopy", label: "Candidate copy", kind: "string" },
  { id: "referenceCopy", label: "Reference copy", kind: "string" },
  { id: "ngramWordCount", label: "Ngram word count", kind: "number" },
  {
    id: "callerOverlapReviewThresholdFraction",
    label: "Caller overlap review threshold fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(
    input.callerOverlapReviewThresholdFraction,
    "callerOverlapReviewThresholdFraction",
  );
  const a = ngrams(wordTokens(input.candidateCopy), input.ngramWordCount),
    b = ngrams(wordTokens(input.referenceCopy), input.ngramWordCount);
  if (!a.size || !b.size)
    simpleError(
      "copy",
      "Both copies need enough word tokens for caller ngram length.",
    );
  const shared = [...a].filter((v) => b.has(v)).length,
    overlap = shared / a.size;
  return {
    uniqueCandidateNgramCount: a.size,
    sharedNgramCount: shared,
    candidateNgramContainmentFraction: overlap,
    callerOverlapReviewFlag:
      overlap >= input.callerOverlapReviewThresholdFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  candidateCopy: "alpha beta gamma delta",
  referenceCopy: "alpha beta gamma omega",
  ngramWordCount: 2,
  callerOverlapReviewThresholdFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  uniqueCandidateNgramCount: 3,
  sharedNgramCount: 2,
  candidateNgramContainmentFraction: 0.6666666666666666,
  callerOverlapReviewFlag: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/plagiarism-self-plagiarism-overlap-threshold-checker",
  title: "Plagiarism Self Plagiarism Overlap Threshold Checker",
  description:
    "Audit ordered word-ngram containment in actual copy with case-folded Unicode word tokens and caller review threshold; unlike unordered back-translation Jaccard this preserves adjacency. Overlap does not establish plagiarism, licensing or self-plagiarism.",
  inputs: inputFields,
  outputs: [
    {
      id: "uniqueCandidateNgramCount",
      label: "Unique candidate ngram count",
      kind: "number",
    },
    { id: "sharedNgramCount", label: "Shared ngram count", kind: "number" },
    {
      id: "candidateNgramContainmentFraction",
      label: "Candidate ngram containment fraction",
      kind: "number",
    },
    {
      id: "callerOverlapReviewFlag",
      label: "Caller overlap review flag",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      candidateCopy: value.candidateCopy as string,
      referenceCopy: value.referenceCopy as string,
      ngramWordCount: value.ngramWordCount as number,
      callerOverlapReviewThresholdFraction:
        value.callerOverlapReviewThresholdFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
