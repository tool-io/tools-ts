import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedInheritedIraKeys: readonly string[];
  readonly callerVerifiedInheritedIraNotices: readonly string[];
  readonly queryInheritedIraKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedInheritedIraKeys",
    label: "Caller verified inherited ira keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedInheritedIraNotices",
    label: "Caller verified inherited ira notices",
    kind: "stringList",
  },
  {
    id: "queryInheritedIraKey",
    label: "Query inherited ira key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedInheritedIraKeys,
      input.callerVerifiedInheritedIraNotices,
      input.queryInheritedIraKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedInheritedIraKeys: ["site-a/edition-a", "site-a/edition-b"],
  callerVerifiedInheritedIraNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryInheritedIraKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/inherited-ira-10-year-rule-checker",
  title: "Inherited IRA 10 Year Rule Checker",
  description:
    "Caller independently verified beneficiary/owner-death/year inherited IRA rule;10-year title not universal waiver of annual distributions. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedInheritedIraKeys:
        value.callerVerifiedInheritedIraKeys as readonly string[],
      callerVerifiedInheritedIraNotices:
        value.callerVerifiedInheritedIraNotices as readonly string[],
      queryInheritedIraKey: value.queryInheritedIraKey as string,
    }),
});
export const run = tool.execute;
export default tool;
