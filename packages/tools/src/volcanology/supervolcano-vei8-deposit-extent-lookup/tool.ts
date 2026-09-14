import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  notice,
  ownReference,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSource: string;
  readonly callerVerifiedContext: string;
  readonly callerVerifiedAsOfDate: string;
  readonly callerReferenceKeys: readonly string[];
  readonly callerReferenceTexts: readonly string[];
  readonly queryReferenceKey: string;
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
    id: "callerReferenceKeys",
    label: "Caller reference keys",
    kind: "stringList",
  },
  {
    id: "callerReferenceTexts",
    label: "Caller reference texts",
    kind: "stringList",
  },
  { id: "queryReferenceKey", label: "Query reference key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  ownReference(
    i.callerVerifiedSource,
    i.callerVerifiedContext,
    i.callerVerifiedAsOfDate,
  );
  return {
    qualifiedReferenceText: notice(
      i.callerReferenceKeys,
      i.callerReferenceTexts,
      i.queryReferenceKey,
    ),
    source: i.callerVerifiedSource,
    context: i.callerVerifiedContext,
    asOfDate: i.callerVerifiedAsOfDate,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    callerVerifiedSource: "independently-reviewed-source/edition",
    callerVerifiedContext:
      "actual eruption, deposit threshold/mapping method and independently evaluated extent",
    callerVerifiedAsOfDate: "2026-01-01",
    callerReferenceKeys: ["record-a", "record-b"],
    callerReferenceTexts: [
      "Illustrative qualified record; replace with actual applicable evidence.",
      "Second illustrative record, not normative data.",
    ],
    queryReferenceKey: "record-a",
  },
  output: {
    result: {
      qualifiedReferenceText:
        "Illustrative qualified record; replace with actual applicable evidence.",
      source: "independently-reviewed-source/edition",
      context:
        "actual eruption, deposit threshold/mapping method and independently evaluated extent",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/supervolcano-vei8-deposit-extent-lookup",
  title: "Supervolcano VEI8 Deposit Extent Lookup",
  description:
    "Qualified caller-reference registry: actual eruption, deposit threshold/mapping method and independently evaluated extent. Requires independently applicable source/context/date evidence; not an authoritative table, omitted predictive model, diagnosis, permission, safety or compliance determination.",
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
