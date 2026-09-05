import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedLoanwordEraKeys: readonly string[];
  readonly callerVerifiedLoanwordEraNotices: readonly string[];
  readonly queryLoanwordEraKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedLoanwordEraKeys",
    label: "Caller verified loanword era keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedLoanwordEraNotices",
    label: "Caller verified loanword era notices",
    kind: "stringList",
  },
  {
    id: "queryLoanwordEraKey",
    label: "Query loanword era key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedLoanwordEraKeys,
      input.callerVerifiedLoanwordEraNotices,
      input.queryLoanwordEraKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedLoanwordEraKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedLoanwordEraNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryLoanwordEraKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/english-loanword-source-era-lookup",
  title: "English Loanword Source Era Lookup",
  description:
    "Independently verified English lexeme/source/borrowing-era etymological record, disputed origins remain source evidence. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedLoanwordEraKeys:
        value.callerVerifiedLoanwordEraKeys as readonly string[],
      callerVerifiedLoanwordEraNotices:
        value.callerVerifiedLoanwordEraNotices as readonly string[],
      queryLoanwordEraKey: value.queryLoanwordEraKey as string,
    }),
});
export const run = tool.execute;
export default tool;
