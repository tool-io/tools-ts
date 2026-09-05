import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedDashEditorialUsageKeys: readonly string[];
  readonly callerVerifiedDashEditorialUsageNotices: readonly string[];
  readonly queryDashEditorialUsageKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedDashEditorialUsageKeys",
    label: "Caller verified dash editorial usage keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedDashEditorialUsageNotices",
    label: "Caller verified dash editorial usage notices",
    kind: "stringList",
  },
  {
    id: "queryDashEditorialUsageKey",
    label: "Query dash editorial usage key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedDashEditorialUsageKeys,
      input.callerVerifiedDashEditorialUsageNotices,
      input.queryDashEditorialUsageKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedDashEditorialUsageKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedDashEditorialUsageNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryDashEditorialUsageKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/dash-usage-rules-language-lookup",
  title: "Dash Usage Rules By Language Lookup",
  description:
    "Independently verified language/locale/editorial dash-use reference, not blanket punctuation replacement. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedDashEditorialUsageKeys:
        value.callerVerifiedDashEditorialUsageKeys as readonly string[],
      callerVerifiedDashEditorialUsageNotices:
        value.callerVerifiedDashEditorialUsageNotices as readonly string[],
      queryDashEditorialUsageKey: value.queryDashEditorialUsageKey as string,
    }),
});
export const run = tool.execute;
export default tool;
