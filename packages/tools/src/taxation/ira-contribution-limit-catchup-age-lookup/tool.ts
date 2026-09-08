import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedIraCatchupLimitKeys: readonly string[];
  readonly callerVerifiedIraCatchupLimitNotices: readonly string[];
  readonly queryIraCatchupLimitKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedIraCatchupLimitKeys",
    label: "Caller verified ira catchup limit keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedIraCatchupLimitNotices",
    label: "Caller verified ira catchup limit notices",
    kind: "stringList",
  },
  {
    id: "queryIraCatchupLimitKey",
    label: "Query ira catchup limit key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedIraCatchupLimitKeys,
      input.callerVerifiedIraCatchupLimitNotices,
      input.queryIraCatchupLimitKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedIraCatchupLimitKeys: ["site-a/edition-a", "site-a/edition-b"],
  callerVerifiedIraCatchupLimitNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryIraCatchupLimitKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/ira-contribution-limit-catchup-age-lookup",
  title: "IRA Contribution Limit Catchup Age Lookup",
  description:
    "Caller independently verified tax-year/age/account-type IRA limits; no current-year amounts hardcoded. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedIraCatchupLimitKeys:
        value.callerVerifiedIraCatchupLimitKeys as readonly string[],
      callerVerifiedIraCatchupLimitNotices:
        value.callerVerifiedIraCatchupLimitNotices as readonly string[],
      queryIraCatchupLimitKey: value.queryIraCatchupLimitKey as string,
    }),
});
export const run = tool.execute;
export default tool;
