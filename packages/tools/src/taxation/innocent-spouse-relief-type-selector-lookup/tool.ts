import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedInnocentSpouseRuleKeys: readonly string[];
  readonly callerVerifiedInnocentSpouseRuleNotices: readonly string[];
  readonly queryInnocentSpouseRuleKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedInnocentSpouseRuleKeys",
    label: "Caller verified innocent spouse rule keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedInnocentSpouseRuleNotices",
    label: "Caller verified innocent spouse rule notices",
    kind: "stringList",
  },
  {
    id: "queryInnocentSpouseRuleKey",
    label: "Query innocent spouse rule key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedInnocentSpouseRuleKeys,
      input.callerVerifiedInnocentSpouseRuleNotices,
      input.queryInnocentSpouseRuleKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedInnocentSpouseRuleKeys: [
    "site-a/edition-a",
    "site-a/edition-b",
  ],
  callerVerifiedInnocentSpouseRuleNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryInnocentSpouseRuleKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/innocent-spouse-relief-type-selector-lookup",
  title: "Innocent Spouse Relief Type Selector Lookup",
  description:
    "Exact independently verified relief type/jurisdiction/year rule lookup, distinct from existing spouse-fact suggested-path selector. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedInnocentSpouseRuleKeys:
        value.callerVerifiedInnocentSpouseRuleKeys as readonly string[],
      callerVerifiedInnocentSpouseRuleNotices:
        value.callerVerifiedInnocentSpouseRuleNotices as readonly string[],
      queryInnocentSpouseRuleKey: value.queryInnocentSpouseRuleKey as string,
    }),
});
export const run = tool.execute;
export default tool;
