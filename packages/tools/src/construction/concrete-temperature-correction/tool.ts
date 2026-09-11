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
  readonly verifiedTemperatureKnots: readonly number[];
  readonly verifiedStrengthCorrectionKnots: readonly number[];
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
    id: "verifiedTemperatureKnots",
    label: "Verified temperature knots",
    kind: "numberList",
  },
  {
    id: "verifiedStrengthCorrectionKnots",
    label: "Verified strength correction knots",
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
      input.verifiedTemperatureKnots,
      input.verifiedStrengthCorrectionKnots,
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
      "Actual mix/test age/specimen matched strength temperature correction independently calibrated, not universal temperature factor",
    callerVerifiedAsOfDate: "2026-01-01",
    verifiedTemperatureKnots: [1, 2],
    verifiedStrengthCorrectionKnots: [10, 20],
    actualQueryCoordinate: 1.5,
  },
  output: {
    result: {
      conditionalInterpolatedValue: 15,
      source: "independently-reviewed-calibration/edition",
      context:
        "Actual mix/test age/specimen matched strength temperature correction independently calibrated, not universal temperature factor",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/concrete-temperature-correction",
  title: "Concrete Temperature Correction Calculator",
  description:
    "Actual qualified piecewise-linear calibration for Concrete Temperature Correction Calculator. Actual mix/test age/specimen matched strength temperature correction independently calibrated, not universal temperature factor. Strictly increasing matched knots, no extrapolation; illustrative example not real calibration. Source/context/date independently verified, no scientific universal curve, safe-use approval or guaranteed prediction.",
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
