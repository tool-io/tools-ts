import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  notice,
  ownReference,
} from "../batch47-shared.js";
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
  ownReference(
    input.callerVerifiedSource,
    input.callerVerifiedContext,
    input.callerVerifiedAsOfDate,
  );
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
    callerVerifiedSource: "caller-independently-reviewed-source/edition",
    callerVerifiedContext:
      "actual instrument/procedure/manufacturer or guideline edition, independent qualified clinical context, units, age/population, applicability and dated authority; no fabricated norm, clinical plan or safe procedure",
    callerVerifiedAsOfDate: "2026-01-01",
    callerReferenceKeys: ["record-a", "record-b"],
    callerReferenceTexts: [
      "Illustrative independently verified Demirjian Dental Age Calculator record a",
      "Illustrative independently verified Demirjian Dental Age Calculator record b",
    ],
    queryReferenceKey: "record-a",
  },
  output: {
    result: {
      matchedCallerReference:
        "Illustrative independently verified Demirjian Dental Age Calculator record a",
      source: "caller-independently-reviewed-source/edition",
      context:
        "actual instrument/procedure/manufacturer or guideline edition, independent qualified clinical context, units, age/population, applicability and dated authority; no fabricated norm, clinical plan or safe procedure",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/dental-age-demirjian",
  title: "Demirjian Dental Age Calculator",
  description:
    "Exact independently verified Demirjian Dental Age Calculator reference lookup with source, context and as-of date. Required context: actual instrument/procedure/manufacturer or guideline edition, independent qualified clinical context, units, age/population, applicability and dated authority; no fabricated norm, clinical plan or safe procedure. Caller supplies actual applicable qualified records; illustrative examples are not authoritative clinical/normative data. No default dosage, normal range, diagnosis, individual risk estimate, treatment plan or safe procedure is fabricated.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
