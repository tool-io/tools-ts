import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  ownReference,
  percentileInterpolation as referenceInterpolation,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSource: string;
  readonly callerVerifiedContext: string;
  readonly callerVerifiedAsOfDate: string;
  readonly verifiedMeasurementKnots: readonly number[];
  readonly verifiedPercentileKnots: readonly number[];
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
    id: "verifiedMeasurementKnots",
    label: "Verified measurement knots",
    kind: "numberList",
  },
  {
    id: "verifiedPercentileKnots",
    label: "Verified percentile knots",
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
      input.verifiedMeasurementKnots,
      input.verifiedPercentileKnots,
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
      "twin-growth chorionicity/gestational-age matched percentile chart with independently established age/cohort stratum; verified cohort, protocol, units and applicability",
    callerVerifiedAsOfDate: "2026-01-01",
    verifiedMeasurementKnots: [10, 20],
    verifiedPercentileKnots: [25, 75],
    observedQueryCoordinate: 15,
  },
  output: {
    result: {
      conditionalInterpolatedValue: 50,
      source: "independently-reviewed-reference/edition",
      context:
        "twin-growth chorionicity/gestational-age matched percentile chart with independently established age/cohort stratum; verified cohort, protocol, units and applicability",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/twin-growth-percentile",
  title: "Twin Growth Percentile Calculator",
  description:
    "Interpolate independently verified actual twin-growth chorionicity/gestational-age matched percentile chart with independently established age/cohort stratum reference knots, strictly increasing verifiedMeasurementKnots with same-unit verifiedPercentileKnots. No extrapolation, universal norm or inferred biological age/individual outcome. The caller establishes cohort, measurement/calibration, applicable edition and uncertainty; illustrative knots are not authoritative reference data.",
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
