import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  binary,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerAlreadyEstablishedNormalizedUnrestEvidence: readonly number[];
  readonly callerIndependentScoreWeights: readonly number[];
  readonly knownUnrestEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerKnownWeightedScreenScore: number;
  readonly unassessedScoreWeightFraction: number;
}>;
const inputFields = [
  {
    id: "callerAlreadyEstablishedNormalizedUnrestEvidence",
    label: "Caller already established normalized unrest evidence",
    kind: "numberList",
  },
  {
    id: "callerIndependentScoreWeights",
    label: "Caller independent score weights",
    kind: "numberList",
  },
  {
    id: "knownUnrestEvidenceFlags",
    label: "Known unrest evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerIndependentScoreWeights.forEach((v) =>
    nonnegative(v, "callerIndependentScoreWeights"),
  );
  input.callerAlreadyEstablishedNormalizedUnrestEvidence.forEach((v) =>
    fraction(v, "callerAlreadyEstablishedNormalizedUnrestEvidence"),
  );
  binary(input.knownUnrestEvidenceFlags, "knownUnrestEvidenceFlags");
  aligned(
    input.callerAlreadyEstablishedNormalizedUnrestEvidence,
    input.callerIndependentScoreWeights,
    "callerAlreadyEstablishedNormalizedUnrestEvidence",
  );
  aligned(
    input.callerAlreadyEstablishedNormalizedUnrestEvidence,
    input.knownUnrestEvidenceFlags,
    "callerAlreadyEstablishedNormalizedUnrestEvidence",
  );
  const total = sum(input.callerIndependentScoreWeights),
    known = sum(
      input.callerIndependentScoreWeights.filter(
        (_, i) => input.knownUnrestEvidenceFlags[i],
      ),
    );
  positive(total, "total weights");
  positive(known, "known evidence weight");
  return {
    callerKnownWeightedScreenScore:
      sum(
        input.callerAlreadyEstablishedNormalizedUnrestEvidence.map((v, i) =>
          input.knownUnrestEvidenceFlags[i]
            ? v * input.callerIndependentScoreWeights[i]
            : 0,
        ),
      ) / known,
    unassessedScoreWeightFraction: 1 - known / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAlreadyEstablishedNormalizedUnrestEvidence: [0.5, 1],
  callerIndependentScoreWeights: [1, 3],
  knownUnrestEvidenceFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  callerKnownWeightedScreenScore: 0.5,
  unassessedScoreWeightFraction: 0.75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/dormancy-reactivation-risk-score",
  title: "Dormancy Reactivation Risk Score Calculator",
  description:
    "Explicit caller-defined unrest evidence screen with missing-weight fraction, score NOT calibrated eruption probability or dormancy/reactivation forecast. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerKnownWeightedScreenScore",
      label: "Caller known weighted screen score",
      kind: "number",
    },
    {
      id: "unassessedScoreWeightFraction",
      label: "Unassessed score weight fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAlreadyEstablishedNormalizedUnrestEvidence:
        value.callerAlreadyEstablishedNormalizedUnrestEvidence as readonly number[],
      callerIndependentScoreWeights:
        value.callerIndependentScoreWeights as readonly number[],
      knownUnrestEvidenceFlags:
        value.knownUnrestEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
