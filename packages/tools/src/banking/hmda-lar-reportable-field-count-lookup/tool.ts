import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  notice,
  bounded,
  daysBetween,
} from "../batch45-shared.js";
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
    callerVerifiedContext: "reporting year, institution and applicable schema",
    callerVerifiedAsOfDate: "2026-01-01",
    callerReferenceKeys: ["record-a", "record-b"],
    callerReferenceTexts: [
      "Caller independently verified HMDA LAR field inventory record a",
      "Caller independently verified HMDA LAR field inventory record b",
    ],
    queryReferenceKey: "record-a",
  },
  output: {
    result: {
      matchedCallerReference:
        "Caller independently verified HMDA LAR field inventory record a",
      source: "independently-reviewed-source/edition",
      context: "reporting year, institution and applicable schema",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/hmda-lar-reportable-field-count-lookup",
  title: "HMDA LAR Reportable Field Count Lookup",
  description:
    "Exact independently verified HMDA LAR field inventory reference registry lookup in explicit reporting year, institution and applicable schema context, retaining source and as-of date. Caller supplies the actual applicable record, including qualifications, exceptions and uncertainty; illustrative examples are not authoritative records. No built-in complete/current data, eligibility, authenticity, legal/coverage determination or advice.",
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
