import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  ownReference,
  referenceInterpolation,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSource: string;
  readonly callerVerifiedContext: string;
  readonly callerVerifiedAsOfDate: string;
  readonly callerVerifiedRawScoreKnots: readonly number[];
  readonly callerVerifiedIqScoreKnots: readonly number[];
  readonly observedQueryCoordinate: number;
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
    id: "callerVerifiedRawScoreKnots",
    label: "Caller verified raw score knots",
    kind: "numberList",
  },
  {
    id: "callerVerifiedIqScoreKnots",
    label: "Caller verified iq score knots",
    kind: "numberList",
  },
  {
    id: "observedQueryCoordinate",
    label: "Observed query coordinate",
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
      input.callerVerifiedRawScoreKnots,
      input.callerVerifiedIqScoreKnots,
      input.observedQueryCoordinate,
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
    callerVerifiedSource: "independently-reviewed-reference/edition",
    callerVerifiedContext:
      "age/cohort/instrument matched raw-score to IQstandard-score conversion; verified cohort, protocol, units and applicability",
    callerVerifiedAsOfDate: "2026-01-01",
    callerVerifiedRawScoreKnots: [10, 20],
    callerVerifiedIqScoreKnots: [90, 110],
    observedQueryCoordinate: 15,
  },
  output: {
    result: {
      conditionalInterpolatedValue: 100,
      source: "independently-reviewed-reference/edition",
      context:
        "age/cohort/instrument matched raw-score to IQstandard-score conversion; verified cohort, protocol, units and applicability",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/iq-from-raw-score",
  title: "IQ From Raw Score Calculator",
  description:
    "Interpolate independently verified actual age/cohort/instrument matched raw-score to IQstandard-score conversion reference knots, strictly increasing callerVerifiedRawScoreKnots with same-unit callerVerifiedIqScoreKnots. No extrapolation, universal norm or inferred biological age/individual outcome. The caller establishes cohort, measurement/calibration, applicable edition and uncertainty; illustrative knots are not authoritative reference data.",
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
