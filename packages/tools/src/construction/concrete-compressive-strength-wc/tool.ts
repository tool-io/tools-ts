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
  readonly verifiedWaterCementRatioKnots: readonly number[];
  readonly verifiedCompressiveStrengthKnots: readonly number[];
  readonly actualQueryCoordinate: number;
}>;
export type Output = ReturnType<typeof calculate>;
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
    id: "verifiedWaterCementRatioKnots",
    label: "Verified water cement ratio knots",
    kind: "numberList",
  },
  {
    id: "verifiedCompressiveStrengthKnots",
    label: "Verified compressive strength knots",
    kind: "numberList",
  },
  {
    id: "actualQueryCoordinate",
    label: "Actual query coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  ownReference(
    input.callerVerifiedSource,
    input.callerVerifiedContext,
    input.callerVerifiedAsOfDate,
  );
  return {
    conditionalInterpolatedValue: referenceInterpolation(
      input.verifiedWaterCementRatioKnots,
      input.verifiedCompressiveStrengthKnots,
      input.actualQueryCoordinate,
    ),
    source: input.callerVerifiedSource,
    context: input.callerVerifiedContext,
    asOfDate: input.callerVerifiedAsOfDate,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedSource: "independently-reviewed-calibration/edition",
    callerVerifiedContext:
      "Actual concrete mix/aggregate/curing-age calibrated strengthversusw/c mass ratio, applicable test specimen/units; not universal Abramsconstants",
    callerVerifiedAsOfDate: "2026-01-01",
    verifiedWaterCementRatioKnots: [1, 2],
    verifiedCompressiveStrengthKnots: [10, 20],
    actualQueryCoordinate: 1.5,
  },
  output: {
    result: {
      conditionalInterpolatedValue: 15,
      source: "independently-reviewed-calibration/edition",
      context:
        "Actual concrete mix/aggregate/curing-age calibrated strengthversusw/c mass ratio, applicable test specimen/units; not universal Abramsconstants",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/concrete-compressive-strength-wc",
  title: "Concrete Compressive Strength From WC Calculator",
  description:
    "Actual qualified piecewise-linear calibration for Concrete Compressive Strength From WC Calculator. Actual concrete mix/aggregate/curing-age calibrated strengthversusw/c mass ratio, applicable test specimen/units; not universal Abramsconstants. Strictly increasing matched knots, no extrapolation; illustrative example not real calibration. Source/context/date independently verified, no scientific universal curve, safe-use approval or guaranteed prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conditionalInterpolatedValue: { type: "number" },
          source: { type: "string" },
          context: { type: "string" },
          asOfDate: { type: "string" },
        },
        required: [
          "conditionalInterpolatedValue",
          "source",
          "context",
          "asOfDate",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
