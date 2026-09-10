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
  readonly verifiedExcessCarrierDensityKnots: readonly number[];
  readonly verifiedSignedRefractiveIndexChangeKnots: readonly number[];
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
    id: "verifiedExcessCarrierDensityKnots",
    label: "Verified excess carrier density knots",
    kind: "numberList",
  },
  {
    id: "verifiedSignedRefractiveIndexChangeKnots",
    label: "Verified signed refractive index change knots",
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
      input.verifiedExcessCarrierDensityKnots,
      input.verifiedSignedRefractiveIndexChangeKnots,
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
      "actual carrier-induced refractive-index change; actual material/cohort, method, units and applicability independently verified",
    callerVerifiedAsOfDate: "2026-01-01",
    verifiedExcessCarrierDensityKnots: [1, 2],
    verifiedSignedRefractiveIndexChangeKnots: [10, 20],
    observedQueryCoordinate: 1.5,
  },
  output: {
    result: {
      conditionalInterpolatedValue: 15,
      source: "independently-calibrated-study/edition",
      context:
        "actual carrier-induced refractive-index change; actual material/cohort, method, units and applicability independently verified",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/carrier-induced-refractive-index-change",
  title: "Semiconductor Carrier Induced Refractive Index Change Calculator",
  description:
    "Conditional independently matched piecewise-linear actual carrier-induced refractive-index change reference interpolation. Strictly increasing verifiedExcessCarrierDensityKnots and aligned same-unit verifiedSignedRefractiveIndexChangeKnots required, no extrapolation. Examples are illustrative knots, not verified normative data; actual calibration, branch selection, uncertainty and applicability external. Not automatic parameter fitting, physical identity, clinical recommendation or a validated hazard forecast.",
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
