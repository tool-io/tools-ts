import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  ownReference,
  referenceInterpolation,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSource: string;
  readonly callerVerifiedContext: string;
  readonly callerVerifiedAsOfDate: string;
  readonly verifiedCoordinateKnots: readonly number[];
  readonly verifiedValueKnots: readonly number[];
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
    id: "verifiedCoordinateKnots",
    label: "Verified coordinate knots",
    kind: "numberList",
  },
  {
    id: "verifiedValueKnots",
    label: "Verified value knots",
    kind: "numberList",
  },
  {
    id: "actualQueryCoordinate",
    label: "Actual query coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  ownReference(
    input.callerVerifiedSource,
    input.callerVerifiedContext,
    input.callerVerifiedAsOfDate,
  );
  return {
    conditionalInterpolatedValue: referenceInterpolation(
      input.verifiedCoordinateKnots,
      input.verifiedValueKnots,
      input.actualQueryCoordinate,
    ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    callerVerifiedSource: "independently-reviewed-calibration/edition",
    callerVerifiedContext:
      "Actual independently verifieddaycoordinate/EOTsigned-minute ephemeriscalibration,calendar/longitudeconvention heldmatched",
    callerVerifiedAsOfDate: "2026-01-01",
    verifiedCoordinateKnots: [1, 2],
    verifiedValueKnots: [10, 20],
    actualQueryCoordinate: 1.5,
  },
  output: { result: { conditionalInterpolatedValue: 15 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horology/equation-of-time-lookup",
  title: "Equation of Time Deviation Lookup",
  description:
    "Qualified piecewise-linear calibration for Equation of Time Deviation Lookup. Actual independently verifieddaycoordinate/EOTsigned-minute ephemeriscalibration,calendar/longitudeconvention heldmatched. Increasingmatchedknots,noextrapolation,no universalcurve or fit. Examplesillustrative,actualsource independently verified;no safe-use approval or validated forecast.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalInterpolatedValue: { type: "number" } },
        required: ["conditionalInterpolatedValue"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
