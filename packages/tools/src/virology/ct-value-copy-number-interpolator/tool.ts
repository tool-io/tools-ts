import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  ownReference,
  lerpTable,
} from "../batch53-shared.js";

export type Input = Readonly<{
  ct: number;
  standardCts: readonly number[];
  standardLog10Copies: readonly number[];
  callerVerifiedSource: string;
  callerVerifiedContext: string;
  callerVerifiedAsOfDate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "ct", label: "Ct", kind: "number" },
  { id: "standardCts", label: "Standard cts", kind: "numberList" },
  {
    id: "standardLog10Copies",
    label: "Standard log10 copies",
    kind: "numberList",
  },
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
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  ownReference(
    i.callerVerifiedSource,
    i.callerVerifiedContext,
    i.callerVerifiedAsOfDate,
  );
  const log10Copies = lerpTable(i.standardCts, i.standardLog10Copies, i.ct);
  return { log10Copies, copies: 10 ** log10Copies };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    callerVerifiedSource: "illustrative-qualified-reference/edition",
    callerVerifiedContext:
      "Illustrative independently checked topic-specific record, not an authoritative default.",
    callerVerifiedAsOfDate: "2026-01-01",
    ct: 20,
    standardCts: [10, 20, 30],
    standardLog10Copies: [3, 2, 1],
  },
  output: { result: { log10Copies: 2, copies: 100 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/ct-value-copy-number-interpolator",
  title: "Ct Value Cycle Threshold Copy Number Log Interpolator",
  description:
    "Interpolate caller qualified standard-curve Ct knots in log10-copy space without extrapolation; does not invent a PCR calibration.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
