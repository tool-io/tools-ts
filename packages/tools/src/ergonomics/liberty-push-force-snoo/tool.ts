import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  ownReference,
  lerpTable,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSource: string;
  readonly callerVerifiedContext: string;
  readonly callerVerifiedAsOfDate: string;
  readonly acceptedPercentages: readonly number[];
  readonly qualifiedPushLimitsN: readonly number[];
  readonly query: number;
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
    id: "acceptedPercentages",
    label: "Accepted percentages",
    kind: "numberList",
  },
  {
    id: "qualifiedPushLimitsN",
    label: "Qualified push limits n",
    kind: "numberList",
  },
  { id: "query", label: "Query", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  ownReference(
    i.callerVerifiedSource,
    i.callerVerifiedContext,
    i.callerVerifiedAsOfDate,
  );
  return {
    interpolatedValue: lerpTable(
      i.acceptedPercentages,
      i.qualifiedPushLimitsN,
      i.query,
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    callerVerifiedSource: "independently-reviewed-calibration/edition",
    callerVerifiedContext:
      "actual Liberty Mutual/Snook population, handle height, push distance, frequency and initial/sustained force table stratum",
    callerVerifiedAsOfDate: "2026-01-01",
    query: 50,
    acceptedPercentages: [10, 90],
    qualifiedPushLimitsN: [200, 100],
  },
  output: { result: { interpolatedValue: 150 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/liberty-push-force-snoo",
  title: "Liberty Mutual Push Force SNOO Estimate Calculator",
  description:
    "Piecewise-linear caller-reference interpolation only: actual Liberty Mutual/Snook population, handle height, push distance, frequency and initial/sustained force table stratum. No extrapolation, causal simulation, safe-use approval or universal prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { interpolatedValue: { type: "number" } },
        required: ["interpolatedValue"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
