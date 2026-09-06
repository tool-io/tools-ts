import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPlatePositionIssueEditionKeys: readonly string[];
  readonly callerVerifiedPlatePositionIssueEditionNotices: readonly string[];
  readonly queryPlatePositionIssueEditionKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedPlatePositionIssueEditionKeys",
    label: "Caller verified plate position issue edition keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPlatePositionIssueEditionNotices",
    label: "Caller verified plate position issue edition notices",
    kind: "stringList",
  },
  {
    id: "queryPlatePositionIssueEditionKey",
    label: "Query plate position issue edition key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedPlatePositionIssueEditionKeys,
      input.callerVerifiedPlatePositionIssueEditionNotices,
      input.queryPlatePositionIssueEditionKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPlatePositionIssueEditionKeys: ["a/edition-a", "b/edition-b"],
  callerVerifiedPlatePositionIssueEditionNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryPlatePositionIssueEditionKey: "b/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/plate-inspector-mark-decoder",
  title: "Plate Number Position Inspector Mark Decoder",
  description:
    "Resolve independently verified issue/plate-position inspector mark records. Exact independently verified edition/context reference key, not embedded or current reference data. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      callerVerifiedPlatePositionIssueEditionKeys:
        value.callerVerifiedPlatePositionIssueEditionKeys as readonly string[],
      callerVerifiedPlatePositionIssueEditionNotices:
        value.callerVerifiedPlatePositionIssueEditionNotices as readonly string[],
      queryPlatePositionIssueEditionKey:
        value.queryPlatePositionIssueEditionKey as string,
    }),
});
export const run = tool.execute;
export default tool;
