import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  notice,
  simpleError,
} from "../batch44-shared.js";

export type Input = Readonly<{
  readonly callerVerifiedSourceEdition: string;
  readonly callerVerifiedReferenceKeys: readonly string[];
  readonly callerVerifiedReferenceTexts: readonly string[];
  readonly queryReferenceKey: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedSourceEdition",
    label: "Caller verified source edition",
    kind: "string",
  },
  {
    id: "callerVerifiedReferenceKeys",
    label: "Caller verified reference keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedReferenceTexts",
    label: "Caller verified reference texts",
    kind: "stringList",
  },
  { id: "queryReferenceKey", label: "Query reference key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    !input.callerVerifiedSourceEdition.trim() ||
    input.callerVerifiedSourceEdition.length > 256
  )
    simpleError(
      "source",
      "Independently verified source/edition/context ID≤256UTF16 units.",
    );
  return {
    matchedCallerReference: notice(
      input.callerVerifiedReferenceKeys,
      input.callerVerifiedReferenceTexts,
      input.queryReferenceKey,
    ),
    referenceSourceEdition: input.callerVerifiedSourceEdition,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedSourceEdition: "caller-reviewed-source-edition",
    callerVerifiedReferenceKeys: ["verified-record-a", "verified-record-b"],
    callerVerifiedReferenceTexts: [
      "Hopscotch courts source-qualified context a",
      "Hopscotch courts source-qualified context b",
    ],
    queryReferenceKey: "verified-record-a",
  },
  output: {
    result: {
      matchedCallerReference: "Hopscotch courts source-qualified context a",
      referenceSourceEdition: "caller-reviewed-source-edition",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/hopscotch-court-design-regional-grid-lookup",
  title: "Hopscotch Court Design Regional Grid Lookup",
  description:
    "Resolve region/version-specific court diagrams and cell order references; no invented universal grid. Exact caller independently verified reference-registry lookup retaining source/edition/context. No built-in complete dataset, current status or attribution authority fabricated.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
