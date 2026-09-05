import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedEjectiveConsonantKeys: readonly string[];
  readonly callerVerifiedEjectiveConsonantNotices: readonly string[];
  readonly queryEjectiveConsonantKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedEjectiveConsonantKeys",
    label: "Caller verified ejective consonant keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedEjectiveConsonantNotices",
    label: "Caller verified ejective consonant notices",
    kind: "stringList",
  },
  {
    id: "queryEjectiveConsonantKey",
    label: "Query ejective consonant key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedEjectiveConsonantKeys,
      input.callerVerifiedEjectiveConsonantNotices,
      input.queryEjectiveConsonantKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedEjectiveConsonantKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedEjectiveConsonantNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryEjectiveConsonantKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/ejective-consonants-language-lookup",
  title: "Ejective Consonants Language Lookup",
  description:
    "Independently attested contrastive ejective evidence under caller variety/protocol inventory. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedEjectiveConsonantKeys:
        value.callerVerifiedEjectiveConsonantKeys as readonly string[],
      callerVerifiedEjectiveConsonantNotices:
        value.callerVerifiedEjectiveConsonantNotices as readonly string[],
      queryEjectiveConsonantKey: value.queryEjectiveConsonantKey as string,
    }),
});
export const run = tool.execute;
export default tool;
