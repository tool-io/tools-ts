import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedAustralianVowelShiftKeys: readonly string[];
  readonly callerVerifiedAustralianVowelShiftNotices: readonly string[];
  readonly queryAustralianVowelShiftKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedAustralianVowelShiftKeys",
    label: "Caller verified australian vowel shift keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAustralianVowelShiftNotices",
    label: "Caller verified australian vowel shift notices",
    kind: "stringList",
  },
  {
    id: "queryAustralianVowelShiftKey",
    label: "Query australian vowel shift key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedAustralianVowelShiftKeys,
      input.callerVerifiedAustralianVowelShiftNotices,
      input.queryAustralianVowelShiftKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedAustralianVowelShiftKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedAustralianVowelShiftNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryAustralianVowelShiftKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/australian-english-vowel-shift-lookup",
  title: "Australian English Vowel Shift Lookup",
  description:
    "Independently documented AustralianEnglish variety/lexical-set shift reference. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedAustralianVowelShiftKeys:
        value.callerVerifiedAustralianVowelShiftKeys as readonly string[],
      callerVerifiedAustralianVowelShiftNotices:
        value.callerVerifiedAustralianVowelShiftNotices as readonly string[],
      queryAustralianVowelShiftKey:
        value.queryAustralianVowelShiftKey as string,
    }),
});
export const run = tool.execute;
export default tool;
