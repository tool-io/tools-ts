import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  positive,
  aligned,
  binary,
  sum,
  shape,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly storyCriterionScores: readonly (readonly number[])[];
  readonly criterionEvidenceFlags: readonly (readonly number[])[];
  readonly callerCriterionWeights: readonly number[];
  readonly callerCriterionMaxima: readonly number[];
}>;
export type Output = Readonly<{
  readonly availableEvidenceWeightedScores: readonly number[];
  readonly availableWeightFractions: readonly number[];
  readonly observedNormalizedScores: readonly number[];
  readonly completeCriterionEvidenceFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "storyCriterionScores",
    label: "Story criterion scores",
    kind: "matrix",
  },
  {
    id: "criterionEvidenceFlags",
    label: "Criterion evidence flags",
    kind: "matrix",
  },
  {
    id: "callerCriterionWeights",
    label: "Caller criterion weights",
    kind: "numberList",
  },
  {
    id: "callerCriterionMaxima",
    label: "Caller criterion maxima",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerCriterionMaxima.forEach((v) =>
    positive(v, "callerCriterionMaxima"),
  );
  input.callerCriterionWeights.forEach((v) =>
    nonnegative(v, "callerCriterionWeights"),
  );
  aligned(
    input.callerCriterionWeights,
    input.callerCriterionMaxima,
    "callerCriterionWeights",
  );
  const width = shape(input.storyCriterionScores, "scores");
  if (
    shape(input.criterionEvidenceFlags, "evidence") !== width ||
    input.criterionEvidenceFlags.length !== input.storyCriterionScores.length ||
    width !== input.callerCriterionWeights.length
  )
    simpleError(
      "matrix",
      "Aligned story/criterion score/evidence matrices and caller weights/maxima required.",
    );
  input.criterionEvidenceFlags.forEach((r) => binary(r, "evidence"));
  const totalWeight = positive(sum(input.callerCriterionWeights), "weights"),
    scores: number[] = [],
    fractions: number[] = [],
    normalized: number[] = [],
    complete: number[] = [];
  input.storyCriterionScores.forEach((row, i) => {
    row.forEach((v, j) => {
      if (
        v < 0 ||
        v > input.callerCriterionMaxima[j] ||
        (!input.criterionEvidenceFlags[i][j] && v !== 0)
      )
        simpleError(
          "score",
          "Scores within caller maxima; missing evidence uses zero sentinel required.",
        );
    });
    const flags = input.criterionEvidenceFlags[i],
      weight = sum(flags.map((v, j) => v * input.callerCriterionWeights[j])),
      score = sum(
        row.map((v, j) => v * flags[j] * input.callerCriterionWeights[j]),
      ),
      maximum = sum(
        flags.map(
          (v, j) =>
            v *
            input.callerCriterionWeights[j] *
            input.callerCriterionMaxima[j],
        ),
      );
    scores.push(score);
    fractions.push(weight / totalWeight);
    normalized.push(maximum ? score / maximum : -1);
    complete.push(flags.every((v) => v === 1) ? 1 : 0);
  });
  return {
    availableEvidenceWeightedScores: scores,
    availableWeightFractions: fractions,
    observedNormalizedScores: normalized,
    completeCriterionEvidenceFlags: complete,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  storyCriterionScores: [
    [3, 4],
    [5, 0],
  ],
  criterionEvidenceFlags: [
    [1, 1],
    [1, 0],
  ],
  callerCriterionWeights: [1, 2],
  callerCriterionMaxima: [5, 5],
} satisfies Input;
export const exampleOutput = {
  availableEvidenceWeightedScores: [11, 5],
  availableWeightFractions: [1, 0.3333333333333333],
  observedNormalizedScores: [0.7333333333333333, 1],
  completeCriterionEvidenceFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/newsworthiness-proximity-prominence-scoring-grid",
  title: "Newsworthiness Proximity Prominence Scoring Grid",
  description:
    "Score actual caller annotated newsworthiness criterion grid with explicit weights/maxima and missing-evidence flags, distinguishing available-evidence normalization from full completeness; no objective newsworthiness ranking or fabricated proximity/prominence scores.",
  inputs: inputFields,
  outputs: [
    {
      id: "availableEvidenceWeightedScores",
      label: "Available evidence weighted scores",
      kind: "numberList",
    },
    {
      id: "availableWeightFractions",
      label: "Available weight fractions",
      kind: "numberList",
    },
    {
      id: "observedNormalizedScores",
      label: "Observed normalized scores",
      kind: "numberList",
    },
    {
      id: "completeCriterionEvidenceFlags",
      label: "Complete criterion evidence flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      storyCriterionScores:
        value.storyCriterionScores as readonly (readonly number[])[],
      criterionEvidenceFlags:
        value.criterionEvidenceFlags as readonly (readonly number[])[],
      callerCriterionWeights: value.callerCriterionWeights as readonly number[],
      callerCriterionMaxima: value.callerCriterionMaxima as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
