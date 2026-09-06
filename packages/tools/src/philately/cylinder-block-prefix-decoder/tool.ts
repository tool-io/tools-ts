import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedCylinderIssueEditionPrefixKeys: readonly string[];
  readonly callerVerifiedCylinderIssueEditionPrefixNotices: readonly string[];
  readonly queryCylinderIssueEditionPrefixKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedCylinderIssueEditionPrefixKeys",
    label: "Caller verified cylinder issue edition prefix keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedCylinderIssueEditionPrefixNotices",
    label: "Caller verified cylinder issue edition prefix notices",
    kind: "stringList",
  },
  {
    id: "queryCylinderIssueEditionPrefixKey",
    label: "Query cylinder issue edition prefix key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedCylinderIssueEditionPrefixKeys,
      input.callerVerifiedCylinderIssueEditionPrefixNotices,
      input.queryCylinderIssueEditionPrefixKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedCylinderIssueEditionPrefixKeys: ["a/edition-a", "b/edition-b"],
  callerVerifiedCylinderIssueEditionPrefixNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryCylinderIssueEditionPrefixKey: "b/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/cylinder-block-prefix-decoder",
  title: "Cylinder Block Prefix Letter Decoder UK Style",
  description:
    "Resolve exact UK cylinder prefix only within caller verified issue/edition glossary, not generic letter meaning. Exact independently verified edition/context reference key, not embedded or current reference data. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      callerVerifiedCylinderIssueEditionPrefixKeys:
        value.callerVerifiedCylinderIssueEditionPrefixKeys as readonly string[],
      callerVerifiedCylinderIssueEditionPrefixNotices:
        value.callerVerifiedCylinderIssueEditionPrefixNotices as readonly string[],
      queryCylinderIssueEditionPrefixKey:
        value.queryCylinderIssueEditionPrefixKey as string,
    }),
});
export const run = tool.execute;
export default tool;
