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
const compute = (i: Input) => {
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
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    callerVerifiedSource: "independently-reviewed-source/edition",
    callerVerifiedContext:
      "actual film stock, exposure/development, scan/color management and independently identified LUT provenance; does not emulate film",
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
        "actual film stock, exposure/development, scan/color management and independently identified LUT provenance; does not emulate film",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/film-stock-look-lut-family-note-lookup",
  title: "Film Stock Look LUT Family Note Lookup",
  description:
    "Qualified caller-reference registry: actual film stock, exposure/development, scan/color management and independently identified LUT provenance; does not emulate film. Requires independently applicable source/context/date evidence; not an authoritative table, omitted predictive model, diagnosis, permission, safety or compliance determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          qualifiedReferenceText: { type: "string" },
          source: { type: "string" },
          context: { type: "string" },
          asOfDate: { type: "string" },
        },
        required: ["qualifiedReferenceText", "source", "context", "asOfDate"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
