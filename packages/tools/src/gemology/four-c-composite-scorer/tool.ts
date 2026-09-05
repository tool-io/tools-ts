import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  binary,
  sum,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyCalibratedFourCScores: readonly number[];
  readonly callerFourCWeights: readonly number[];
  readonly knownFourCFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownFourCWeightedScore: number;
  readonly knownWeightFraction: number;
  readonly completeFourCEvidence: boolean;
}>;
const inputFields = [
  {
    id: "callerIndependentlyCalibratedFourCScores",
    label: "Caller independently calibrated four c scores",
    kind: "numberList",
  },
  {
    id: "callerFourCWeights",
    label: "Caller four c weights",
    kind: "numberList",
  },
  { id: "knownFourCFlags", label: "Known four c flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerFourCWeights.forEach((v) => nonnegative(v, "callerFourCWeights"));
  input.callerIndependentlyCalibratedFourCScores.forEach((v) =>
    fraction(v, "callerIndependentlyCalibratedFourCScores"),
  );
  binary(input.knownFourCFlags, "knownFourCFlags");
  aligned(
    input.callerIndependentlyCalibratedFourCScores,
    input.callerFourCWeights,
    "callerIndependentlyCalibratedFourCScores",
  );
  aligned(
    input.callerFourCWeights,
    input.knownFourCFlags,
    "callerFourCWeights",
  );
  if (input.callerFourCWeights.length !== 4)
    simpleError(
      "4c",
      "Exactlycaller cut, color, clarity, carat assessment coordinates, not raw ordinal grades/mass mixed.",
    );
  const total = positive(sum(input.callerFourCWeights), "weights"),
    known = sum(
      input.callerFourCWeights.map((v, i) => v * input.knownFourCFlags[i]),
    );
  return {
    knownFourCWeightedScore: known
      ? sum(
          input.callerFourCWeights.map(
            (v, i) =>
              v *
              input.knownFourCFlags[i] *
              input.callerIndependentlyCalibratedFourCScores[i],
          ),
        ) / known
      : 0,
    knownWeightFraction: known / total,
    completeFourCEvidence: input.knownFourCFlags.every((v) => v === 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerIndependentlyCalibratedFourCScores: [0.8, 0.6, 0.4, 1],
  callerFourCWeights: [1, 1, 1, 1],
  knownFourCFlags: [1, 1, 1, 0],
} satisfies Input;
export const exampleOutput = {
  knownFourCWeightedScore: 0.6,
  knownWeightFraction: 0.75,
  completeFourCEvidence: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/four-c-composite-scorer",
  title: "Four-C Composite Grade Scorer",
  description:
    "Caller explicitly independently normalized 4 C(not just cut-component) score aggregation with known-weight coverage; unavailable known score uses 0 with 0 coverage, no appraisal/laboratory grade. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownFourCWeightedScore",
      label: "Known four c weighted score",
      kind: "number",
    },
    {
      id: "knownWeightFraction",
      label: "Known weight fraction",
      kind: "number",
    },
    {
      id: "completeFourCEvidence",
      label: "Complete four c evidence",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerIndependentlyCalibratedFourCScores:
        value.callerIndependentlyCalibratedFourCScores as readonly number[],
      callerFourCWeights: value.callerFourCWeights as readonly number[],
      knownFourCFlags: value.knownFourCFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
