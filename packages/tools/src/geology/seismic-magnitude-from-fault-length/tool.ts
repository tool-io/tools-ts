import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  ownReference,
  referenceInterpolation,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSource: string;
  readonly callerVerifiedContext: string;
  readonly callerVerifiedAsOfDate: string;
  readonly verifiedRuptureLengthKmKnots: readonly number[];
  readonly verifiedMagnitudeKnots: readonly number[];
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
    id: "verifiedRuptureLengthKmKnots",
    label: "Verified rupture length km knots",
    kind: "numberList",
  },
  {
    id: "verifiedMagnitudeKnots",
    label: "Verified magnitude knots",
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
      input.verifiedRuptureLengthKmKnots,
      input.verifiedMagnitudeKnots,
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
    callerVerifiedSource: "independently-calibrated-study/edition",
    callerVerifiedContext:
      "independently calibrated fault-length/magnitude relation for actual fault type and rupture definition; actual material/cohort, method, units and applicability independently verified",
    callerVerifiedAsOfDate: "2026-01-01",
    verifiedRuptureLengthKmKnots: [1, 2],
    verifiedMagnitudeKnots: [10, 20],
    observedQueryCoordinate: 1.5,
  },
  output: {
    result: {
      conditionalInterpolatedValue: 15,
      source: "independently-calibrated-study/edition",
      context:
        "independently calibrated fault-length/magnitude relation for actual fault type and rupture definition; actual material/cohort, method, units and applicability independently verified",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/seismic-magnitude-from-fault-length",
  title: "Geology Seismic Magnitude From Fault Length Calculator",
  description:
    "Conditional independently matched piecewise-linear independently calibrated fault-length/magnitude relation for actual fault type and rupture definition reference interpolation. Strictly increasing verifiedRuptureLengthKmKnots and aligned same-unit verifiedMagnitudeKnots required, no extrapolation. Examples are illustrative knots, not verified normative data; actual calibration, branch selection, uncertainty and applicability external. Not automatic parameter fitting, physical identity, clinical recommendation or a validated hazard forecast.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
