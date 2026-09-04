import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedMilestoneTrancheKeys: readonly string[];
  readonly callerVerifiedMilestoneTrancheNotices: readonly string[];
  readonly queryMilestoneTrancheKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedMilestoneTrancheKeys",
    label: "Caller verified milestone tranche keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedMilestoneTrancheNotices",
    label: "Caller verified milestone tranche notices",
    kind: "stringList",
  },
  {
    id: "queryMilestoneTrancheKey",
    label: "Query milestone tranche key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedMilestoneTrancheKeys,
      input.callerVerifiedMilestoneTrancheNotices,
      input.queryMilestoneTrancheKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedMilestoneTrancheKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedMilestoneTrancheNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryMilestoneTrancheKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/ask-size-milestone-linked-tranche-framing-lookup",
  title: "Ask Size Milestone Linked Tranche Framing Lookup",
  description:
    "Caller independently verified milestone evidence/tranche-release contract notice, no automatic fundraising entitlement. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedMilestoneTrancheKeys:
        value.callerVerifiedMilestoneTrancheKeys as readonly string[],
      callerVerifiedMilestoneTrancheNotices:
        value.callerVerifiedMilestoneTrancheNotices as readonly string[],
      queryMilestoneTrancheKey: value.queryMilestoneTrancheKey as string,
    }),
});
export const run = tool.execute;
export default tool;
