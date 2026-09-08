import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedInheritanceClassKeys: readonly string[];
  readonly callerVerifiedInheritanceClassNotices: readonly string[];
  readonly queryInheritanceClassKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedInheritanceClassKeys",
    label: "Caller verified inheritance class keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedInheritanceClassNotices",
    label: "Caller verified inheritance class notices",
    kind: "stringList",
  },
  {
    id: "queryInheritanceClassKey",
    label: "Query inheritance class key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedInheritanceClassKeys,
      input.callerVerifiedInheritanceClassNotices,
      input.queryInheritanceClassKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedInheritanceClassKeys: ["site-a/edition-a", "site-a/edition-b"],
  callerVerifiedInheritanceClassNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryInheritanceClassKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/inheritance-tax-class-beneficiary-lookup",
  title: "Inheritance Tax Class Beneficiary Lookup",
  description:
    "Caller independently verified jurisdiction/year/relationship beneficiary inheritance-tax class notice. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedInheritanceClassKeys:
        value.callerVerifiedInheritanceClassKeys as readonly string[],
      callerVerifiedInheritanceClassNotices:
        value.callerVerifiedInheritanceClassNotices as readonly string[],
      queryInheritanceClassKey: value.queryInheritanceClassKey as string,
    }),
});
export const run = tool.execute;
export default tool;
