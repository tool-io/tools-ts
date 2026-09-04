import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedEarnoutTermsKeys: readonly string[];
  readonly callerVerifiedEarnoutTermsNotices: readonly string[];
  readonly queryEarnoutTermsKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedEarnoutTermsKeys",
    label: "Caller verified earnout terms keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedEarnoutTermsNotices",
    label: "Caller verified earnout terms notices",
    kind: "stringList",
  },
  {
    id: "queryEarnoutTermsKey",
    label: "Query earnout terms key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedEarnoutTermsKeys,
      input.callerVerifiedEarnoutTermsNotices,
      input.queryEarnoutTermsKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedEarnoutTermsKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedEarnoutTermsNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryEarnoutTermsKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/earnout-milestone-clawback-terms-lookup",
  title: "Earnout Milestone Clawback Terms Lookup",
  description:
    "Caller independently verified milestone measurement/clawback/dispute earnout contract notice. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedEarnoutTermsKeys:
        value.callerVerifiedEarnoutTermsKeys as readonly string[],
      callerVerifiedEarnoutTermsNotices:
        value.callerVerifiedEarnoutTermsNotices as readonly string[],
      queryEarnoutTermsKey: value.queryEarnoutTermsKey as string,
    }),
});
export const run = tool.execute;
export default tool;
