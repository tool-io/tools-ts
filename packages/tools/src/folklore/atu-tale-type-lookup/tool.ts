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
    !/^[1-9][0-9]{0,3}[A-Z]?$/.test(input.queryReferenceKey) ||
    input.callerVerifiedReferenceKeys.some(
      (v) => !/^[1-9][0-9]{0,3}[A-Z]?$/.test(v),
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
    callerVerifiedReferenceKeys: ["510A", "333"],
    callerVerifiedReferenceTexts: [
      "Caller verified ATU510A edition entry",
      "Caller verified ATU333 edition entry",
    ],
    queryReferenceKey: "510A",
  },
  output: {
    result: {
      matchedCallerReference: "Caller verified ATU510A edition entry",
      referenceSourceEdition: "caller-reviewed-source-edition",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/atu-tale-type-lookup",
  title: "ATU Tale Type Lookup",
  description:
    "Lookup independently verified Uther ATU tale-type entries; preserve type/edition interpretation rather than classify arbitrary tales. Exact caller independently verified reference-registry lookup retaining source/edition/context. No built-in complete dataset, current status or attribution authority fabricated.",
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
