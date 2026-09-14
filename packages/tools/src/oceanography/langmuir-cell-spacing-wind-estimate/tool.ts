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
  readonly observedWindMPerS: readonly number[];
  readonly qualifiedCellSpacingM: readonly number[];
  readonly query: number;
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
    id: "observedWindMPerS",
    label: "Observed wind m per s",
    kind: "numberList",
  },
  {
    id: "qualifiedCellSpacingM",
    label: "Qualified cell spacing m",
    kind: "numberList",
  },
  { id: "query", label: "Query", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  ownReference(
    i.callerVerifiedSource,
    i.callerVerifiedContext,
    i.callerVerifiedAsOfDate,
  );
  return {
    interpolatedValue: lerpTable(
      i.observedWindMPerS,
      i.qualifiedCellSpacingM,
      i.query,
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    callerVerifiedSource: "independently-reviewed-calibration/edition",
    callerVerifiedContext:
      "actual site, mixed-layer depth, wave state and independently measured wind/cell-spacing calibration, not a universal Langmuir law",
    callerVerifiedAsOfDate: "2026-01-01",
    query: 6,
    observedWindMPerS: [2, 10],
    qualifiedCellSpacingM: [10, 50],
  },
  output: { result: { interpolatedValue: 30 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/langmuir-cell-spacing-wind-estimate",
  title: "Langmuir Cell Spacing Wind Estimate Calculator",
  description:
    "Piecewise-linear caller-reference interpolation only: actual site, mixed-layer depth, wave state and independently measured wind/cell-spacing calibration, not a universal Langmuir law. No extrapolation, causal simulation, safe-use approval or universal prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
