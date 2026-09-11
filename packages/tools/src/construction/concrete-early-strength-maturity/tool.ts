import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  ownReference,
  referenceInterpolation,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSource: string;
  readonly callerVerifiedContext: string;
  readonly callerVerifiedAsOfDate: string;
  readonly verifiedMaturityKnots: readonly number[];
  readonly verifiedEarlyStrengthKnots: readonly number[];
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
    id: "verifiedMaturityKnots",
    label: "Verified maturity knots",
    kind: "numberList",
  },
  {
    id: "verifiedEarlyStrengthKnots",
    label: "Verified early strength knots",
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
      input.verifiedMaturityKnots,
      input.verifiedEarlyStrengthKnots,
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
      "Actual independently calibrated named mix strength versus complete same-edition maturity index, no raw temperature-hours proxy or universal strength curve",
    callerVerifiedAsOfDate: "2026-01-01",
    verifiedMaturityKnots: [1, 2],
    verifiedEarlyStrengthKnots: [10, 20],
    actualQueryCoordinate: 1.5,
  },
  output: {
    result: {
      conditionalInterpolatedValue: 15,
      source: "independently-reviewed-calibration/edition",
      context:
        "Actual independently calibrated named mix strength versus complete same-edition maturity index, no raw temperature-hours proxy or universal strength curve",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/concrete-early-strength-maturity",
  title: "Concrete Early Strength Maturity Calculator",
  description:
    "Actual qualified piecewise-linear calibration for Concrete Early Strength Maturity Calculator. Actual independently calibrated named mix strength versus complete same-edition maturity index, no raw temperature-hours proxy or universal strength curve. Strictly increasing matched knots, no extrapolation; illustrative example not real calibration. Source/context/date independently verified, no scientific universal curve, safe-use approval or guaranteed prediction.",
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
