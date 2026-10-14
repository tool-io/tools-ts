import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  ownReference,
  notice,
} from "../batch49-shared.js";
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
const compute = (input: Input) => {
  ownReference(
    input.callerVerifiedSource,
    input.callerVerifiedContext,
    input.callerVerifiedAsOfDate,
  );
  return {
    qualifiedReferenceText: notice(
      input.callerReferenceKeys,
      input.callerReferenceTexts,
      input.queryReferenceKey,
    ),
    source: input.callerVerifiedSource,
    context: input.callerVerifiedContext,
    asOfDate: input.callerVerifiedAsOfDate,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedSource: "independently-reviewed-authority/edition",
    callerVerifiedContext:
      "actual AASHTO pavement design edition, traffic reliability, soil/drainage, service ability and verified design method; actual source/edition, units, date and applicability independently verified",
    callerVerifiedAsOfDate: "2026-01-01",
    callerReferenceKeys: ["record-a", "record-b"],
    callerReferenceTexts: [
      "Illustrative qualified AASHTO Pavement Thickness Calculator reference; replace with independently verified actual source record",
      "Illustrative qualified AASHTO Pavement Thickness Calculator reference; replace with independently verified actual source record B",
    ],
    queryReferenceKey: "record-a",
  },
  output: {
    result: {
      qualifiedReferenceText:
        "Illustrative qualified AASHTO Pavement Thickness Calculator reference; replace with independently verified actual source record",
      source: "independently-reviewed-authority/edition",
      context:
        "actual AASHTO pavement design edition, traffic reliability, soil/drainage, service ability and verified design method; actual source/edition, units, date and applicability independently verified",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/pavement-thickness-aashto",
  title: "AASHTO Pavement Thickness Calculator",
  description:
    "Exact qualified caller-reference retrieval for AASHTO Pavement Thickness Calculator. Required: actual AASHTO pavement design edition, traffic reliability, soil/drainage, service ability and verified design method; actual source/edition, units, date and applicability independently verified. Not an embedded authoritative database or implementation of an omitted predictive/design model. Examples are illustrative, not verified normative data. No universal dose, rule, fit, eligibility, diagnosis, legal/code compliance or safe operation approval is fabricated; only structure/arithmetic is checked.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
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
