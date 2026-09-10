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
  readonly verifiedAgeCoordinateKnots: readonly number[];
  readonly verifiedWhiteMatterMlKnots: readonly number[];
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
    id: "verifiedAgeCoordinateKnots",
    label: "Verified age coordinate knots",
    kind: "numberList",
  },
  {
    id: "verifiedWhiteMatterMlKnots",
    label: "Verified white matter ml knots",
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
      input.verifiedAgeCoordinateKnots,
      input.verifiedWhiteMatterMlKnots,
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
      "white-matter volume by actual age/cohort; verified cohort, protocol, units and applicability",
    callerVerifiedAsOfDate: "2026-01-01",
    verifiedAgeCoordinateKnots: [1, 2],
    verifiedWhiteMatterMlKnots: [10, 20],
    observedQueryCoordinate: 1.5,
  },
  output: {
    result: {
      conditionalInterpolatedValue: 15,
      source: "independently-reviewed-reference/edition",
      context:
        "white-matter volume by actual age/cohort; verified cohort, protocol, units and applicability",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/white-matter-volume-age",
  title: "White Matter Volume Age Calculator",
  description:
    "Interpolate independently verified actual white-matter volume by actual age/cohort reference knots, strictly increasing verifiedAgeCoordinateKnots with same-unit verifiedWhiteMatterMlKnots. No extrapolation, universal norm or inferred biological age/individual outcome. The caller establishes cohort, measurement/calibration, applicable edition and uncertainty; illustrative knots are not authoritative reference data.",
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
