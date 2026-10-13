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
  readonly verifiedTemperatureCelsiusKnots: readonly number[];
  readonly verifiedPressDurationMinutesKnots: readonly number[];
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
    id: "verifiedTemperatureCelsiusKnots",
    label: "Verified temperature celsius knots",
    kind: "numberList",
  },
  {
    id: "verifiedPressDurationMinutesKnots",
    label: "Verified press duration minutes knots",
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
      input.verifiedTemperatureCelsiusKnots,
      input.verifiedPressDurationMinutesKnots,
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
      "Actual specific adhesive product/stock/moisture/pressure matched independently calibrated press time versus temperature, not universally temperature-halving kinetics",
    callerVerifiedAsOfDate: "2026-01-01",
    verifiedTemperatureCelsiusKnots: [1, 2],
    verifiedPressDurationMinutesKnots: [10, 20],
    actualQueryCoordinate: 1.5,
  },
  output: {
    result: {
      conditionalInterpolatedValue: 15,
      source: "independently-reviewed-calibration/edition",
      context:
        "Actual specific adhesive product/stock/moisture/pressure matched independently calibrated press time versus temperature, not universally temperature-halving kinetics",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/leim-presszeit-temperatur",
  title: "Leim Presszeit Temperatur Calculator",
  description:
    "Actual independently matched piecewise-linear calibration: Actual specific adhesive product/stock/moisture/pressure matched independently calibrated press time versus temperature, not universally temperature-halving kinetics. Actual increasing verified TemperatureCelsiusKnots, aligned verified PressDurationMinutesKnots, no extrapolation; example knots illustrative, not normative. Independent fit/branch/uncertainty and applicability external, not guaranteed physical outcome, clinical recommendation, design code or safety approval.",
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
