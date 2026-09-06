import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedWatermarkIssueEditionCodeKeys: readonly string[];
  readonly callerVerifiedWatermarkIssueEditionCodeNotices: readonly string[];
  readonly queryWatermarkIssueEditionCodeKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedWatermarkIssueEditionCodeKeys",
    label: "Caller verified watermark issue edition code keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedWatermarkIssueEditionCodeNotices",
    label: "Caller verified watermark issue edition code notices",
    kind: "stringList",
  },
  {
    id: "queryWatermarkIssueEditionCodeKey",
    label: "Query watermark issue edition code key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedWatermarkIssueEditionCodeKeys,
      input.callerVerifiedWatermarkIssueEditionCodeNotices,
      input.queryWatermarkIssueEditionCodeKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedWatermarkIssueEditionCodeKeys: ["a/edition-a", "b/edition-b"],
  callerVerifiedWatermarkIssueEditionCodeNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryWatermarkIssueEditionCodeKey: "b/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/watermark-type-lookup",
  title: "Watermark Type Identifier Code Lookup (crown/anchor etc.)",
  description:
    "Resolve issue/edition-specific caller watermark codes and descriptions. Exact independently verified edition/context reference key, not embedded or current reference data. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      callerVerifiedWatermarkIssueEditionCodeKeys:
        value.callerVerifiedWatermarkIssueEditionCodeKeys as readonly string[],
      callerVerifiedWatermarkIssueEditionCodeNotices:
        value.callerVerifiedWatermarkIssueEditionCodeNotices as readonly string[],
      queryWatermarkIssueEditionCodeKey:
        value.queryWatermarkIssueEditionCodeKey as string,
    }),
});
export const run = tool.execute;
export default tool;
