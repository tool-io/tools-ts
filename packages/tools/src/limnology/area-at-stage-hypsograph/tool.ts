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
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
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
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    callerVerifiedSource: "independently-reviewed-calibration/edition",
    callerVerifiedContext:
      "Actualincreasinglakelevel/area hypsographiccalibration,nonnegative independentlyqualifiedareas,not stage/storagevolumeor extrapolation",
    callerVerifiedAsOfDate: "2026-01-01",
    verifiedCoordinateKnots: [1, 2],
    verifiedValueKnots: [10, 20],
    actualQueryCoordinate: 1.5,
  },
  output: { result: { conditionalInterpolatedValue: 15 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/area-at-stage-hypsograph",
  title: "Area At Stage Hypsograph Calculator",
  description:
    "Qualified piecewise-linear calibration for Area At Stage Hypsograph Calculator. Actualincreasinglakelevel/area hypsographiccalibration,nonnegative independentlyqualifiedareas,not stage/storagevolumeor extrapolation. Increasingmatchedknots,noextrapolation,no universalcurve or fit. Examplesillustrative,actualsource independently verified;no safe-use approval or validated forecast.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
