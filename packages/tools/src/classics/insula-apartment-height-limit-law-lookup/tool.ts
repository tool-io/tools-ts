import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly callerVerifiedEditionContextKeys: readonly string[];
  readonly callerVerifiedReferenceTexts: readonly string[];
  readonly queryEditionContextKey: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedEditionContextKeys",
    label: "Caller verified edition context keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedReferenceTexts",
    label: "Caller verified reference texts",
    kind: "stringList",
  },
  {
    id: "queryEditionContextKey",
    label: "Query edition context key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    matchedCallerReference: notice(
      input.callerVerifiedEditionContextKeys,
      input.callerVerifiedReferenceTexts,
      input.queryEditionContextKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedEditionContextKeys: [
      "source-a/edition-a/context-a",
      "source-b/edition-b/context-b",
    ],
    callerVerifiedReferenceTexts: [
      "InsulaHeightLaw independently established source-a reference",
      "InsulaHeightLaw independently established source-b reference",
    ],
    queryEditionContextKey: "source-a/edition-a/context-a",
  },
  output: {
    result: {
      matchedCallerReference:
        "InsulaHeightLaw independently established source-a reference",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/insula-apartment-height-limit-law-lookup",
  title: "Insula Apartment Height Limit Law Lookup",
  description:
    "Resolve specific ruler/period/source height restrictions with verified ancient units; not current code compliance. Exact source/edition/context reference lookup; caller independently verifies text, applicability and uncertainty. No invented current, normative or universal data.",
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
