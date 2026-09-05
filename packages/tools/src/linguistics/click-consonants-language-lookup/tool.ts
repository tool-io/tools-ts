import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedClickConsonantKeys: readonly string[];
  readonly callerVerifiedClickConsonantNotices: readonly string[];
  readonly queryClickConsonantKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedClickConsonantKeys",
    label: "Caller verified click consonant keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedClickConsonantNotices",
    label: "Caller verified click consonant notices",
    kind: "stringList",
  },
  {
    id: "queryClickConsonantKey",
    label: "Query click consonant key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedClickConsonantKeys,
      input.callerVerifiedClickConsonantNotices,
      input.queryClickConsonantKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedClickConsonantKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedClickConsonantNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryClickConsonantKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/click-consonants-language-lookup",
  title: "Click Consonants Language Lookup",
  description:
    "Independently attested contrastive click evidence vs caller phoneme inventory reference, loans/allophones explicitly caller established. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedClickConsonantKeys:
        value.callerVerifiedClickConsonantKeys as readonly string[],
      callerVerifiedClickConsonantNotices:
        value.callerVerifiedClickConsonantNotices as readonly string[],
      queryClickConsonantKey: value.queryClickConsonantKey as string,
    }),
});
export const run = tool.execute;
export default tool;
