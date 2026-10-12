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
  readonly qualifiedMassesSolar: readonly number[];
  readonly qualifiedBrightPhaseYears: readonly number[];
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
    id: "qualifiedMassesSolar",
    label: "Qualified masses solar",
    kind: "numberList",
  },
  {
    id: "qualifiedBrightPhaseYears",
    label: "Qualified bright phase years",
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
      i.qualifiedMassesSolar,
      i.qualifiedBrightPhaseYears,
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
      "actual metallicity, track edition and independently defined bright-phase criterion; no omitted stellar evolution model",
    callerVerifiedAsOfDate: "2026-01-01",
    query: 0.2,
    qualifiedMassesSolar: [0.1, 0.3],
    qualifiedBrightPhaseYears: [1000000000, 100000000],
  },
  output: { result: { interpolatedValue: 550000000 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/reddwarf-premainseq-bright-phase-duration",
  title: "Red Dwarf Pre-Main-Sequence Bright Phase Duration Calculator",
  description:
    "Piecewise-linear caller-reference interpolation only: actual metallicity, track edition and independently defined bright-phase criterion; no omitted stellar evolution model. No extrapolation, causal simulation, safe-use approval or universal prediction.",
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
