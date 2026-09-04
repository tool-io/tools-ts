import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedReferralRewardsKeys: readonly string[];
  readonly callerVerifiedReferralRewardsNotices: readonly string[];
  readonly queryReferralRewardsKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedReferralRewardsKeys",
    label: "Caller verified referral rewards keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedReferralRewardsNotices",
    label: "Caller verified referral rewards notices",
    kind: "stringList",
  },
  {
    id: "queryReferralRewardsKey",
    label: "Query referral rewards key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedReferralRewardsKeys,
      input.callerVerifiedReferralRewardsNotices,
      input.queryReferralRewardsKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedReferralRewardsKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedReferralRewardsNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryReferralRewardsKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/referral-incentive-two-sided-reward-design-lookup",
  title: "Referral Incentive Two Sided Reward Design Lookup",
  description:
    "Caller independently verified jurisdiction/program two-sided referral reward eligibility/terms notice. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedReferralRewardsKeys:
        value.callerVerifiedReferralRewardsKeys as readonly string[],
      callerVerifiedReferralRewardsNotices:
        value.callerVerifiedReferralRewardsNotices as readonly string[],
      queryReferralRewardsKey: value.queryReferralRewardsKey as string,
    }),
});
export const run = tool.execute;
export default tool;
