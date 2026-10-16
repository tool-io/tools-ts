import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  ownReference,
  qualifiedLookup,
} from "../batch53-shared.js";

export type Input = Readonly<{
  callerVerifiedSource: string;
  callerVerifiedContext: string;
  callerVerifiedAsOfDate: string;
  queryKey: string;
  callerReferenceKeys: readonly string[];
  callerReferenceTexts: readonly string[];
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
  { id: "queryKey", label: "Query key", kind: "string" },
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
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  ownReference(
    i.callerVerifiedSource,
    i.callerVerifiedContext,
    i.callerVerifiedAsOfDate,
  );
  return qualifiedLookup(
    i.queryKey,
    i.callerReferenceKeys,
    i.callerReferenceTexts,
    i,
  );
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    callerVerifiedSource: "illustrative-qualified-reference/edition",
    callerVerifiedContext:
      "Illustrative independently checked topic-specific record, not an authoritative default.",
    callerVerifiedAsOfDate: "2026-01-01",
    queryKey: "example",
    callerReferenceKeys: ["example"],
    callerReferenceTexts: ["Illustrative applicable reference evidence."],
  },
  output: {
    result: {
      matched: true,
      referenceText: "Illustrative applicable reference evidence.",
      source: "illustrative-qualified-reference/edition",
      context:
        "Illustrative independently checked topic-specific record, not an authoritative default.",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/prior-restraint-injunction-expedited-appeal-response-lookup",
  title: "Prior Restraint Injunction Expedited Appeal Response Lookup",
  description:
    "Retrieve prior restraint injunction expedited appeal response lookup from caller independently verified exact-key records with source, context and date. No built-in authoritative table, hidden model, clinical recommendation or automatic compliance determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          matched: { type: "boolean" },
          referenceText: { anyOf: [{ type: "string" }, { type: "null" }] },
          source: { type: "string" },
          context: { type: "string" },
          asOfDate: { type: "string" },
        },
        required: ["matched", "referenceText", "source", "context", "asOfDate"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
