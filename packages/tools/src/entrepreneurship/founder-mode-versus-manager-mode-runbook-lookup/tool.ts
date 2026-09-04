import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedManagementRunbookKeys: readonly string[];
  readonly callerVerifiedManagementRunbookNotices: readonly string[];
  readonly queryManagementRunbookKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedManagementRunbookKeys",
    label: "Caller verified management runbook keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedManagementRunbookNotices",
    label: "Caller verified management runbook notices",
    kind: "stringList",
  },
  {
    id: "queryManagementRunbookKey",
    label: "Query management runbook key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedManagementRunbookKeys,
      input.callerVerifiedManagementRunbookNotices,
      input.queryManagementRunbookKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedManagementRunbookKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedManagementRunbookNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryManagementRunbookKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/founder-mode-versus-manager-mode-runbook-lookup",
  title: "Founder Mode Versus Manager Mode Runbook Lookup",
  description:
    "Caller independently documented organizational-context founder/manager mode runbook, no universally superior behavior. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedManagementRunbookKeys:
        value.callerVerifiedManagementRunbookKeys as readonly string[],
      callerVerifiedManagementRunbookNotices:
        value.callerVerifiedManagementRunbookNotices as readonly string[],
      queryManagementRunbookKey: value.queryManagementRunbookKey as string,
    }),
});
export const run = tool.execute;
export default tool;
