import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedCdsIssueRadiusClassKeys: readonly string[];
  readonly callerVerifiedCdsIssueRadiusClassNotices: readonly string[];
  readonly queryCdsIssueRadiusClassKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedCdsIssueRadiusClassKeys",
    label: "Caller verified cds issue radius class keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedCdsIssueRadiusClassNotices",
    label: "Caller verified cds issue radius class notices",
    kind: "stringList",
  },
  {
    id: "queryCdsIssueRadiusClassKey",
    label: "Query cds issue radius class key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedCdsIssueRadiusClassKeys,
      input.callerVerifiedCdsIssueRadiusClassNotices,
      input.queryCdsIssueRadiusClassKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedCdsIssueRadiusClassKeys: ["a/edition-a", "b/edition-b"],
  callerVerifiedCdsIssueRadiusClassNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryCdsIssueRadiusClassKey: "b/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/cds-radius-size-class-lookup",
  title: "Circular Date Stamp Radius Size Class Lookup",
  description:
    "Resolve caller documented issue/radius-class circular date stamp description, no automatic era inference. Exact independently verified edition/context reference key, not embedded or current reference data. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      callerVerifiedCdsIssueRadiusClassKeys:
        value.callerVerifiedCdsIssueRadiusClassKeys as readonly string[],
      callerVerifiedCdsIssueRadiusClassNotices:
        value.callerVerifiedCdsIssueRadiusClassNotices as readonly string[],
      queryCdsIssueRadiusClassKey: value.queryCdsIssueRadiusClassKey as string,
    }),
});
export const run = tool.execute;
export default tool;
