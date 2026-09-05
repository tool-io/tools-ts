import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFictionalLanguageKeys: readonly string[];
  readonly callerVerifiedFictionalLanguageNotices: readonly string[];
  readonly queryFictionalLanguageKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedFictionalLanguageKeys",
    label: "Caller verified fictional language keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFictionalLanguageNotices",
    label: "Caller verified fictional language notices",
    kind: "stringList",
  },
  {
    id: "queryFictionalLanguageKey",
    label: "Query fictional language key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedFictionalLanguageKeys,
      input.callerVerifiedFictionalLanguageNotices,
      input.queryFictionalLanguageKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFictionalLanguageKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedFictionalLanguageNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryFictionalLanguageKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/fictional-language-source-work-lookup",
  title: "Fictional Language Source Work Lookup",
  description:
    "Independently verified fictional language/source-work/edition record. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedFictionalLanguageKeys:
        value.callerVerifiedFictionalLanguageKeys as readonly string[],
      callerVerifiedFictionalLanguageNotices:
        value.callerVerifiedFictionalLanguageNotices as readonly string[],
      queryFictionalLanguageKey: value.queryFictionalLanguageKey as string,
    }),
});
export const run = tool.execute;
export default tool;
