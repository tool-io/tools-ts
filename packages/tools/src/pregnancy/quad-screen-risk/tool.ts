import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  ownReference,
  gaussianProbability,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSource: string;
  readonly callerVerifiedContext: string;
  readonly callerVerifiedAsOfDate: string;
  readonly independentlyAdjustedLogMomValues: readonly number[];
  readonly callerValidatedAffectedMean: readonly number[];
  readonly callerValidatedUnaffectedMean: readonly number[];
  readonly callerValidatedAffectedCovariance: readonly (readonly number[])[];
  readonly callerValidatedUnaffectedCovariance: readonly (readonly number[])[];
  readonly callerValidatedPriorProbability: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedSource",
    label: "Caller verified source",
    kind: "string",
  },
  {
    id: "callerVerifiedContext",
    label: "Caller verified context",
    kind: "string",
  },
  {
    id: "callerVerifiedAsOfDate",
    label: "Caller verified as of date",
    kind: "string",
  },
  {
    id: "independentlyAdjustedLogMomValues",
    label: "Independently adjusted log mom values",
    kind: "numberList",
  },
  {
    id: "callerValidatedAffectedMean",
    label: "Caller validated affected mean",
    kind: "numberList",
  },
  {
    id: "callerValidatedUnaffectedMean",
    label: "Caller validated unaffected mean",
    kind: "numberList",
  },
  {
    id: "callerValidatedAffectedCovariance",
    label: "Caller validated affected covariance",
    kind: "matrix",
  },
  {
    id: "callerValidatedUnaffectedCovariance",
    label: "Caller validated unaffected covariance",
    kind: "matrix",
  },
  {
    id: "callerValidatedPriorProbability",
    label: "Caller validated prior probability",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  ownReference(
    input.callerVerifiedSource,
    input.callerVerifiedContext,
    input.callerVerifiedAsOfDate,
  );
  return gaussianProbability(
    input.independentlyAdjustedLogMomValues,
    input.callerValidatedAffectedMean,
    input.callerValidatedUnaffectedMean,
    input.callerValidatedAffectedCovariance,
    input.callerValidatedUnaffectedCovariance,
    input.callerValidatedPriorProbability,
    4,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedSource: "independently-validated-model/edition",
    callerVerifiedContext:
      "quad AFP/hCG/uE3/inhibin-A four-marker log-MoM screening; target condition/cohort/assay/dating matched",
    callerVerifiedAsOfDate: "2026-01-01",
    independentlyAdjustedLogMomValues: [0, 0, 0, 0],
    callerValidatedAffectedMean: [0, 0, 0, 0],
    callerValidatedUnaffectedMean: [0, 0, 0, 0],
    callerValidatedAffectedCovariance: [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ],
    callerValidatedUnaffectedCovariance: [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ],
    callerValidatedPriorProbability: 0.01,
  },
  output: {
    result: {
      conditionalPosteriorModelProbability: 0.01,
      conditionalLogLikelihoodRatio: 0,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/quad-screen-risk",
  title: "Quad Screen Risk Calculator",
  description:
    "Conditional quad AFP/hCG/uE3/inhibin-A four-marker log-MoM screening Gaussian-class likelihood calculation with independently validated full correlated covariance matrices and matched prior. Log-MoMadjustment, model applicability, target definition and clinical validation external; illustrative parameters are not a real screening model. No naive marker independence, diagnosis, individual outcome certainty or testing recommendation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
