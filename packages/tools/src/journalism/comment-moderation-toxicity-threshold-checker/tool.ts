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
  aligned,
  binary,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly callerModelToxicityFractions: readonly number[];
  readonly scoreEvidenceFlags: readonly number[];
  readonly callerReviewThresholdFraction: number;
}>;
export type Output = Readonly<{
  readonly aboveCallerThresholdCommentIndices: readonly number[];
  readonly missingScoreCommentIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "callerModelToxicityFractions",
    label: "Caller model toxicity fractions",
    kind: "numberList",
  },
  {
    id: "scoreEvidenceFlags",
    label: "Score evidence flags",
    kind: "numberList",
  },
  {
    id: "callerReviewThresholdFraction",
    label: "Caller review threshold fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(
    input.callerReviewThresholdFraction,
    "callerReviewThresholdFraction",
  );
  binary(input.scoreEvidenceFlags, "scoreEvidenceFlags");
  aligned(
    input.callerModelToxicityFractions,
    input.scoreEvidenceFlags,
    "callerModelToxicityFractions",
  );
  input.callerModelToxicityFractions.forEach((v, i) => {
    fraction(v, "score");
    if (!input.scoreEvidenceFlags[i] && v !== 0)
      simpleError(
        "missing",
        "Missing model score needs explicit zero sentinel.",
      );
  });
  return {
    aboveCallerThresholdCommentIndices:
      input.callerModelToxicityFractions.flatMap((v, i) =>
        input.scoreEvidenceFlags[i] && v >= input.callerReviewThresholdFraction
          ? [i]
          : [],
      ),
    missingScoreCommentIndices: input.scoreEvidenceFlags.flatMap((v, i) =>
      !v ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerModelToxicityFractions: [0.2, 0.9, 0],
  scoreEvidenceFlags: [1, 1, 0],
  callerReviewThresholdFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  aboveCallerThresholdCommentIndices: [1],
  missingScoreCommentIndices: [2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/comment-moderation-toxicity-threshold-checker",
  title: "Comment Moderation Toxicity Threshold Checker",
  description:
    "Screen actual caller model scores under explicit inclusive moderation review threshold, preserving missing scores; no text toxicity inference, calibrated probability, guaranteed safe/unsafe comment or automatic content deletion.",
  inputs: inputFields,
  outputs: [
    {
      id: "aboveCallerThresholdCommentIndices",
      label: "Above caller threshold comment indices",
      kind: "numberList",
    },
    {
      id: "missingScoreCommentIndices",
      label: "Missing score comment indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerModelToxicityFractions:
        value.callerModelToxicityFractions as readonly number[],
      scoreEvidenceFlags: value.scoreEvidenceFlags as readonly number[],
      callerReviewThresholdFraction:
        value.callerReviewThresholdFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
