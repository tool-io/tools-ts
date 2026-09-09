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
      "actual athlete/task, front/rear measurements, protocol and independently verified source",
    callerVerifiedAsOfDate: "2026-01-01",
    callerReferenceKeys: ["record-a", "record-b"],
    callerReferenceTexts: [
      "Illustrative independently verified sprint-block geometry research record a",
      "Illustrative independently verified sprint-block geometry research record b",
    ],
    queryReferenceKey: "record-a",
  },
  output: {
    result: {
      matchedCallerReference:
        "Illustrative independently verified sprint-block geometry research record a",
      source: "caller-independently-reviewed-source/edition",
      context:
        "actual athlete/task, front/rear measurements, protocol and independently verified source",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/sprint-start-block-spacing-front-rear-inch-settings",
  title: "Sprint Start Block Spacing Front Rear Inch Settings",
  description:
    "Exact independently verified sprint-block geometry research reference lookup with source, context and as-of date. Required context: actual athlete/task, front/rear measurements, protocol and independently verified source. Caller supplies actual applicable qualified records; illustrative examples are not authoritative clinical/normative data. No default dosage, normal range, diagnosis, individual risk estimate, treatment plan or safe procedure is fabricated.",
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
