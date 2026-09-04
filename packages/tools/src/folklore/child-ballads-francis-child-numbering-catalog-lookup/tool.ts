import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
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
  if (
    !/^(?:[1-9]|[1-9][0-9]|[12][0-9]{2}|30[0-5])$/.test(
      input.queryReferenceKey,
    ) ||
    input.callerVerifiedReferenceKeys.some(
      (v) => !/^(?:[1-9]|[1-9][0-9]|[12][0-9]{2}|30[0-5])$/.test(v),
    )
  )
    simpleError(
      "key",
      "Explicit bounded reference code syntax; no catalog membership inferred.",
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
    callerVerifiedReferenceKeys: ["1", "305"],
    callerVerifiedReferenceTexts: [
      "Caller verified Child1 entry/version",
      "Caller verified Child305 entry/version",
    ],
    queryReferenceKey: "1",
  },
  output: {
    result: {
      matchedCallerReference: "Caller verified Child1 entry/version",
      referenceSourceEdition: "caller-reviewed-source-edition",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/child-ballads-francis-child-numbering-catalog-lookup",
  title: "Child Ballads Francis Child Numbering Catalog Lookup",
  description:
    "Lookup source-qualified Child ballad entries1\u2013305, including independently recorded version context. Exact caller independently verified reference-registry lookup retaining source/edition/context. No built-in complete dataset, current status or attribution authority fabricated.",
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
