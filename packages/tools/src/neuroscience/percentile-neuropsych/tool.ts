import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  ownReference,
  referencePercentile,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSource: string;
  readonly callerVerifiedContext: string;
  readonly callerVerifiedAsOfDate: string;
  readonly callerMatchedNormativeScores: readonly number[];
  readonly callerVerifiedNormativeWeights: readonly number[];
  readonly independentlyObservedRawScore: number;
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
    id: "callerMatchedNormativeScores",
    label: "Caller matched normative scores",
    kind: "numberList",
  },
  {
    id: "callerVerifiedNormativeWeights",
    label: "Caller verified normative weights",
    kind: "numberList",
  },
  {
    id: "independentlyObservedRawScore",
    label: "Independently observed raw score",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  ownReference(
    input.callerVerifiedSource,
    input.callerVerifiedContext,
    input.callerVerifiedAsOfDate,
  );
  return {
    conditionalMatchedMidrankPercentile: referencePercentile(
      input.callerMatchedNormativeScores,
      input.callerVerifiedNormativeWeights,
      input.independentlyObservedRawScore,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedSource: "normative-study/edition",
    callerVerifiedContext:
      "actual neuropsychological instrument, age/cohort, language and score direction",
    callerVerifiedAsOfDate: "2026-01-01",
    callerMatchedNormativeScores: [1, 2, 2, 4],
    callerVerifiedNormativeWeights: [1, 1, 1, 1],
    independentlyObservedRawScore: 2,
  },
  output: { result: { conditionalMatchedMidrankPercentile: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/percentile-neuropsych",
  title: "Neuropsych Percentile Calculator",
  description:
    "Actual verified normative weighted midrank percentile with half ties, not assume Gaussian distribution, invent population norms, age-adjust automatically or infer IQ/diagnosis. Appropriate score direction, reference representativeness and instrument version independently reviewed.",
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
