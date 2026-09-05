import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedNasalVowelKeys: readonly string[];
  readonly callerVerifiedNasalVowelNotices: readonly string[];
  readonly queryNasalVowelKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedNasalVowelKeys",
    label: "Caller verified nasal vowel keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedNasalVowelNotices",
    label: "Caller verified nasal vowel notices",
    kind: "stringList",
  },
  { id: "queryNasalVowelKey", label: "Query nasal vowel key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedNasalVowelKeys,
      input.callerVerifiedNasalVowelNotices,
      input.queryNasalVowelKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedNasalVowelKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedNasalVowelNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryNasalVowelKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/nasal-vowels-language-checker",
  title: "Nasal Vowels Language Checker",
  description:
    "Independently documented contrastive nasal vowels, not merely nasalization before nasal consonants. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedNasalVowelKeys:
        value.callerVerifiedNasalVowelKeys as readonly string[],
      callerVerifiedNasalVowelNotices:
        value.callerVerifiedNasalVowelNotices as readonly string[],
      queryNasalVowelKey: value.queryNasalVowelKey as string,
    }),
});
export const run = tool.execute;
export default tool;
