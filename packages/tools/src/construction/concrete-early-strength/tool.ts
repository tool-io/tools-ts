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
  readonly verifiedAgeKnots: readonly number[];
  readonly verifiedStrengthKnots: readonly number[];
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
  { id: "verifiedAgeKnots", label: "Verified age knots", kind: "numberList" },
  {
    id: "verifiedStrengthKnots",
    label: "Verified strength knots",
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
      input.verifiedAgeKnots,
      input.verifiedStrengthKnots,
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
      "Actual named mix/curing state calibrated early strength-versus age, not maturity index or universal cement curve",
    callerVerifiedAsOfDate: "2026-01-01",
    verifiedAgeKnots: [1, 2],
    verifiedStrengthKnots: [10, 20],
    actualQueryCoordinate: 1.5,
  },
  output: {
    result: {
      conditionalInterpolatedValue: 15,
      source: "independently-reviewed-calibration/edition",
      context:
        "Actual named mix/curing state calibrated early strength-versus age, not maturity index or universal cement curve",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/concrete-early-strength",
  title: "Concrete Early Strength Calculator",
  description:
    "Actual qualified piecewise-linear calibration for Concrete Early Strength Calculator. Actual named mix/curing state calibrated early strength-versus age, not maturity index or universal cement curve. Strictly increasing matched knots, no extrapolation; illustrative example not real calibration. Source/context/date independently verified, no scientific universal curve, safe-use approval or guaranteed prediction.",
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
