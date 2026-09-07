import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedAuditStatuteKeys: readonly string[];
  readonly callerVerifiedAuditStatuteNotices: readonly string[];
  readonly queryAuditStatuteKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedAuditStatuteKeys",
    label: "Caller verified audit statute keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAuditStatuteNotices",
    label: "Caller verified audit statute notices",
    kind: "stringList",
  },
  {
    id: "queryAuditStatuteKey",
    label: "Query audit statute key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedAuditStatuteKeys,
      input.callerVerifiedAuditStatuteNotices,
      input.queryAuditStatuteKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedAuditStatuteKeys: ["site-a/edition-a", "site-a/edition-b"],
  callerVerifiedAuditStatuteNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryAuditStatuteKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/audit-window-statute-limitations-lookup",
  title: "Audit Window Statute Limitations Lookup",
  description:
    "Caller independently verified jurisdiction/return/fraud/omission/waiver audit limitation notice; no universal3-year rule. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedAuditStatuteKeys:
        value.callerVerifiedAuditStatuteKeys as readonly string[],
      callerVerifiedAuditStatuteNotices:
        value.callerVerifiedAuditStatuteNotices as readonly string[],
      queryAuditStatuteKey: value.queryAuditStatuteKey as string,
    }),
});
export const run = tool.execute;
export default tool;
