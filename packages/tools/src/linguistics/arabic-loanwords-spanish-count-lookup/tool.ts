import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSpanishArabicLexiconKeys: readonly string[];
  readonly callerVerifiedSpanishArabicLexiconNotices: readonly string[];
  readonly querySpanishArabicLexiconKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedSpanishArabicLexiconKeys",
    label: "Caller verified spanish arabic lexicon keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedSpanishArabicLexiconNotices",
    label: "Caller verified spanish arabic lexicon notices",
    kind: "stringList",
  },
  {
    id: "querySpanishArabicLexiconKey",
    label: "Query spanish arabic lexicon key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedSpanishArabicLexiconKeys,
      input.callerVerifiedSpanishArabicLexiconNotices,
      input.querySpanishArabicLexiconKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedSpanishArabicLexiconKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedSpanishArabicLexiconNotices: [
    "independent reference a",
    "independent reference b",
  ],
  querySpanishArabicLexiconKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/arabic-loanwords-spanish-count-lookup",
  title: "Arabic Loanwords in Spanish Count Lookup",
  description:
    "Independently verified corpus/dictionary edition Arabic-origin Spanish count record; no fixed language-wide count. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedSpanishArabicLexiconKeys:
        value.callerVerifiedSpanishArabicLexiconKeys as readonly string[],
      callerVerifiedSpanishArabicLexiconNotices:
        value.callerVerifiedSpanishArabicLexiconNotices as readonly string[],
      querySpanishArabicLexiconKey:
        value.querySpanishArabicLexiconKey as string,
    }),
});
export const run = tool.execute;
export default tool;
