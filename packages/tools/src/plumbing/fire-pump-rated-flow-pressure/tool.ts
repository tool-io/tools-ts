import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  ownReference,
  referenceInterpolation,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSource: string;
  readonly callerVerifiedContext: string;
  readonly callerVerifiedAsOfDate: string;
  readonly verifiedPumpFlowGpmKnots: readonly number[];
  readonly verifiedNetPumpPressurePsiKnots: readonly number[];
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
    id: "verifiedPumpFlowGpmKnots",
    label: "Verified pump flow gpm knots",
    kind: "numberList",
  },
  {
    id: "verifiedNetPumpPressurePsiKnots",
    label: "Verified net pump pressure psi knots",
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
      input.verifiedPumpFlowGpmKnots,
      input.verifiedNetPumpPressurePsiKnots,
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
      "Actual independently manufacturer-certified fire pump net pressure curve at actual rated flow, matched speed/diameter fluid, suction conditions",
    callerVerifiedAsOfDate: "2026-01-01",
    verifiedPumpFlowGpmKnots: [1, 2],
    verifiedNetPumpPressurePsiKnots: [10, 20],
    actualQueryCoordinate: 1.5,
  },
  output: {
    result: {
      conditionalInterpolatedValue: 15,
      source: "independently-reviewed-calibration/edition",
      context:
        "Actual independently manufacturer-certified fire pump net pressure curve at actual rated flow, matched speed/diameter fluid, suction conditions",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/fire-pump-rated-flow-pressure",
  title: "Plumbing Fire Pump Rated Flow Pressure Calculator",
  description:
    "Actual independently matched piecewise-linear calibration: Actual independently manufacturer-certified fire pump net pressure curve at actual rated flow, matched speed/diameter fluid, suction conditions. Actual increasing verified PumpFlowGpmKnots, aligned verified NetPumpPressurePsiKnots, no extrapolation; example knots illustrative, not normative. Independent fit/branch/uncertainty and applicability external, not guaranteed physical outcome, clinical recommendation, design code or safety approval.",
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
