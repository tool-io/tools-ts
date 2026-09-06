import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFeedbackStudyKeys: readonly string[];
  readonly callerVerifiedFeedbackStudyNotices: readonly string[];
  readonly queryFeedbackStudyKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedFeedbackStudyKeys",
    label: "Caller verified feedback study keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFeedbackStudyNotices",
    label: "Caller verified feedback study notices",
    kind: "stringList",
  },
  {
    id: "queryFeedbackStudyKey",
    label: "Query feedback study key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedFeedbackStudyKeys,
      input.callerVerifiedFeedbackStudyNotices,
      input.queryFeedbackStudyKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFeedbackStudyKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedFeedbackStudyNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryFeedbackStudyKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/grades-only-comment-suppression-butler-studies-verdict-lookup",
  title: "Grades Only Comment Suppression Butler Studies Verdict Lookup",
  description:
    "Caller independently verified Butler study/task/population/outcome effect record, not universal grades-versus-comments causal verdict. Exact independently verified context/edition key; not embedded or live reference data. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
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
      callerVerifiedFeedbackStudyKeys:
        value.callerVerifiedFeedbackStudyKeys as readonly string[],
      callerVerifiedFeedbackStudyNotices:
        value.callerVerifiedFeedbackStudyNotices as readonly string[],
      queryFeedbackStudyKey: value.queryFeedbackStudyKey as string,
    }),
});
export const run = tool.execute;
export default tool;
