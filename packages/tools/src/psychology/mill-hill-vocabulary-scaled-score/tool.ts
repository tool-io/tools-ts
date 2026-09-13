import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  ownReference,
  referenceInterpolation,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSource: string;
  readonly callerVerifiedContext: string;
  readonly callerVerifiedAsOfDate: string;
  readonly verifiedRawScoreKnots: readonly number[];
  readonly verifiedScaledScoreKnots: readonly number[];
  readonly actualQueryCoordinate: number;
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
    id: "verifiedRawScoreKnots",
    label: "Verified raw score knots",
    kind: "numberList",
  },
  {
    id: "verifiedScaledScoreKnots",
    label: "Verified scaled score knots",
    kind: "numberList",
  },
  {
    id: "actualQueryCoordinate",
    label: "Actual query coordinate",
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
    conditionalInterpolatedValue: referenceInterpolation(
      input.verifiedRawScoreKnots,
      input.verifiedScaledScoreKnots,
      input.actualQueryCoordinate,
    ),
    source: input.callerVerifiedSource,
    context: input.callerVerifiedContext,
    asOfDate: input.callerVerifiedAsOfDate,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedSource: "independently-reviewed-calibration/edition",
    callerVerifiedContext:
      "Actual separately verified instrument age/cohort/edition raw-to-scaled-score conversion Mill Hill Vocabulary Scaled Score Converter",
    callerVerifiedAsOfDate: "2026-01-01",
    verifiedRawScoreKnots: [1, 2],
    verifiedScaledScoreKnots: [10, 20],
    actualQueryCoordinate: 1.5,
  },
  output: {
    result: {
      conditionalInterpolatedValue: 15,
      source: "independently-reviewed-calibration/edition",
      context:
        "Actual separately verified instrument age/cohort/edition raw-to-scaled-score conversion Mill Hill Vocabulary Scaled Score Converter",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/mill-hill-vocabulary-scaled-score",
  title: "Mill Hill Vocabulary Scaled Score Converter",
  description:
    "Actual independently matched piecewise-linear calibration: Actual separately verified instrument age/cohort/edition raw-to-scaled-score conversion Mill Hill Vocabulary Scaled Score Converter. Actual increasing verified RawScoreKnots, aligned verified ScaledScoreKnots, no extrapolation; example knots illustrative, not normative. Independent fit/branch/uncertainty and applicability external, not guaranteed physical outcome, clinical recommendation, design code or safety approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
