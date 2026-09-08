import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  notice,
  bounded,
  daysBetween,
} from "../batch46-shared.js";
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
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    !input.callerVerifiedSource.trim() ||
    !input.callerVerifiedContext.trim() ||
    Math.max(
      input.callerVerifiedSource.length,
      input.callerVerifiedContext.length,
    ) > 256
  )
    simpleError(
      "reference",
      "Explicit independently verified bounded source and context.",
    );
  daysBetween(input.callerVerifiedAsOfDate, input.callerVerifiedAsOfDate);
  return {
    matchedCallerReference: notice(
      input.callerReferenceKeys,
      input.callerReferenceTexts,
      input.queryReferenceKey,
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
    callerVerifiedSource: "independently-reviewed-source/edition",
    callerVerifiedContext:
      "study/site, actual measurement definition, context and independent evidence",
    callerVerifiedAsOfDate: "2026-01-01",
    callerReferenceKeys: ["record-a", "record-b"],
    callerReferenceTexts: [
      "Caller independently verified defensible-space visibility metrics record a",
      "Caller independently verified defensible-space visibility metrics record b",
    ],
    queryReferenceKey: "record-a",
  },
  output: {
    result: {
      matchedCallerReference:
        "Caller independently verified defensible-space visibility metrics record a",
      source: "independently-reviewed-source/edition",
      context:
        "study/site, actual measurement definition, context and independent evidence",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/defensible-space-eyes-on-street-ratio-lookup",
  title: "Defensible Space Eyes On Street Ratio Lookup",
  description:
    "Exact independently verified defensible-space visibility metrics registry lookup in explicit study/site, actual measurement definition, context and independent evidence context, retaining source and as-of date. Caller supplies actual applicable records, qualifications and uncertainty; illustrative examples are not authoritative data. No complete/current catalog, eligibility, authenticity, clinical, legal, safety or compliance determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
