import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  safeText,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerNormalizedCandidateNames: readonly string[];
  readonly callerResolvedOfacName: string;
  readonly callerReviewSimilarityThreshold: number;
}>;
export type Output = Readonly<{
  readonly observedNameSimilarityScores: readonly number[];
  readonly callerNameReviewCandidates: readonly string[];
}>;
const inputFields = [
  {
    id: "callerNormalizedCandidateNames",
    label: "Caller normalized candidate names",
    kind: "stringList",
  },
  {
    id: "callerResolvedOfacName",
    label: "Caller resolved ofac name",
    kind: "string",
  },
  {
    id: "callerReviewSimilarityThreshold",
    label: "Caller review similarity threshold",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  safeText(input.callerResolvedOfacName, "name");
  fraction(input.callerReviewSimilarityThreshold, "threshold");
  if (input.callerNormalizedCandidateNames.some((s) => !s.trim()))
    simpleError("names", "Nonempty independently normalized names required.");
  const reference = input.callerResolvedOfacName,
    score = (s: string) => {
      let row = Array.from({ length: reference.length + 1 }, (_, i) => i);
      for (let i = 0; i < s.length; i++) {
        const next = [i + 1];
        for (let j = 0; j < reference.length; j++)
          next.push(
            Math.min(
              next[j] + 1,
              row[j + 1] + 1,
              row[j] + (s[i] === reference[j] ? 0 : 1),
            ),
          );
        row = next;
      }
      return 1 - row[reference.length] / Math.max(s.length, reference.length);
    };
  const scores = input.callerNormalizedCandidateNames.map(score);
  return {
    observedNameSimilarityScores: scores,
    callerNameReviewCandidates: input.callerNormalizedCandidateNames.filter(
      (_, i) => scores[i] >= input.callerReviewSimilarityThreshold,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerNormalizedCandidateNames: ["ALICE", "ALICE B"],
  callerResolvedOfacName: "ALICE",
  callerReviewSimilarityThreshold: 0.8,
} satisfies Input;
export const exampleOutput = {
  observedNameSimilarityScores: [1, 0.7142857142857143],
  callerNameReviewCandidates: ["ALICE"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/ofac-name-screen-threshold-scorer",
  title: "OFAC Name Screen Threshold Scorer",
  description:
    "Bounded Levenshtein name similarity against independently resolved OFAC reference with caller review cutoff, normalized names explicit; not sanctions clearance, identity match or verified sanctions list. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedNameSimilarityScores",
      label: "Observed name similarity scores",
      kind: "numberList",
    },
    {
      id: "callerNameReviewCandidates",
      label: "Caller name review candidates",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerNormalizedCandidateNames:
        value.callerNormalizedCandidateNames as readonly string[],
      callerResolvedOfacName: value.callerResolvedOfacName as string,
      callerReviewSimilarityThreshold:
        value.callerReviewSimilarityThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
