import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedConstructedLanguageKeys: readonly string[];
  readonly callerVerifiedConstructedLanguageNotices: readonly string[];
  readonly queryConstructedLanguageKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedConstructedLanguageKeys",
    label: "Caller verified constructed language keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedConstructedLanguageNotices",
    label: "Caller verified constructed language notices",
    kind: "stringList",
  },
  {
    id: "queryConstructedLanguageKey",
    label: "Query constructed language key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedConstructedLanguageKeys,
      input.callerVerifiedConstructedLanguageNotices,
      input.queryConstructedLanguageKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedConstructedLanguageKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedConstructedLanguageNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryConstructedLanguageKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/constructed-language-creator-year-lookup",
  title: "Constructed Language Creator & Year Lookup",
  description:
    "Independently verified constructed-language creator/edition/date record. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedConstructedLanguageKeys:
        value.callerVerifiedConstructedLanguageKeys as readonly string[],
      callerVerifiedConstructedLanguageNotices:
        value.callerVerifiedConstructedLanguageNotices as readonly string[],
      queryConstructedLanguageKey: value.queryConstructedLanguageKey as string,
    }),
});
export const run = tool.execute;
export default tool;
