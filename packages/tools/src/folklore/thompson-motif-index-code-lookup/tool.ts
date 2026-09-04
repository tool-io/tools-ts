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
    !/^[A-Z][0-9]{1,4}(?:\.[0-9]{1,4}){0,4}$/.test(input.queryReferenceKey) ||
    input.callerVerifiedReferenceKeys.some(
      (v) => !/^[A-Z][0-9]{1,4}(?:\.[0-9]{1,4}){0,4}$/.test(v),
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
    callerVerifiedReferenceKeys: ["D672", "B300.1"],
    callerVerifiedReferenceTexts: [
      "Caller verified D672 edition entry",
      "Caller verified B300.1 edition entry",
    ],
    queryReferenceKey: "D672",
  },
  output: {
    result: {
      matchedCallerReference: "Caller verified D672 edition entry",
      referenceSourceEdition: "caller-reviewed-source-edition",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/thompson-motif-index-code-lookup",
  title: "Thompson Motif Index Code Lookup",
  description:
    "Lookup independently verified Thompson motif-index codes, not an ATU tale-type equivalence or unrestricted story parser. Exact caller independently verified reference-registry lookup retaining source/edition/context. No built-in complete dataset, current status or attribution authority fabricated.",
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
