import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedQuotationStyleKeys: readonly string[];
  readonly callerVerifiedQuotationStyleNotices: readonly string[];
  readonly queryQuotationStyleKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedQuotationStyleKeys",
    label: "Caller verified quotation style keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedQuotationStyleNotices",
    label: "Caller verified quotation style notices",
    kind: "stringList",
  },
  {
    id: "queryQuotationStyleKey",
    label: "Query quotation style key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedQuotationStyleKeys,
      input.callerVerifiedQuotationStyleNotices,
      input.queryQuotationStyleKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedQuotationStyleKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedQuotationStyleNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryQuotationStyleKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/quotation-mark-style-by-language-lookup",
  title: "Quotation Mark Style By Language Lookup",
  description:
    "Independently verified language/locale/editorial edition quotation-mark style, not normalize prose without context. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchedCallerNotice",
      label: "Matched caller notice",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedQuotationStyleKeys:
        value.callerVerifiedQuotationStyleKeys as readonly string[],
      callerVerifiedQuotationStyleNotices:
        value.callerVerifiedQuotationStyleNotices as readonly string[],
      queryQuotationStyleKey: value.queryQuotationStyleKey as string,
    }),
});
export const run = tool.execute;
export default tool;
