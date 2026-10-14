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
  readonly qualifiedCarryWeightsKg: readonly number[];
  readonly qualifiedAcceptancePercentages: readonly number[];
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
    id: "qualifiedCarryWeightsKg",
    label: "Qualified carry weights kg",
    kind: "numberList",
  },
  {
    id: "qualifiedAcceptancePercentages",
    label: "Qualified acceptance percentages",
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
      i.qualifiedCarryWeightsKg,
      i.qualifiedAcceptancePercentages,
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
      "actual Liberty Mutual carrying population, distance, frequency and handle configuration; source percentiles not inferred",
    callerVerifiedAsOfDate: "2026-01-01",
    query: 20,
    qualifiedCarryWeightsKg: [10, 30],
    qualifiedAcceptancePercentages: [90, 10],
  },
  output: { result: { interpolatedValue: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/liberty-carry-percentile-checker",
  title: "Liberty Mutual Carry Weight Acceptance Percentile Checker",
  description:
    "Piecewise-linear caller-reference interpolation only: actual Liberty Mutual carrying population, distance, frequency and handle configuration; source percentiles not inferred. No extrapolation, causal simulation, safe-use approval or universal prediction.",
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
