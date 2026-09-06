import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, dateOrder } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly postmarkDate: string;
  readonly callerVerifiedFirstIssueDate: string;
}>;
export type Output = Readonly<{
  readonly matchesCallerFirstIssueDate: boolean;
  readonly signedPostmarkAfterIssueDays: number;
}>;
const inputFields = [
  { id: "postmarkDate", label: "Postmark date", kind: "string" },
  {
    id: "callerVerifiedFirstIssueDate",
    label: "Caller verified first issue date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const gap = dateOrder(input.callerVerifiedFirstIssueDate, input.postmarkDate);
  return {
    matchesCallerFirstIssueDate: gap === 0,
    signedPostmarkAfterIssueDays: gap,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  postmarkDate: "2026-01-02",
  callerVerifiedFirstIssueDate: "2026-01-02",
} satisfies Input;
export const exampleOutput = {
  matchesCallerFirstIssueDate: true,
  signedPostmarkAfterIssueDays: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/fdc-postmark-date-validator",
  title: "First Day Cover Postmark Date Match Validator",
  description:
    "Compare real civil postmark and caller verified first-issue dates; matching date does not authenticate first-day use. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchesCallerFirstIssueDate",
      label: "Matches caller first issue date",
      kind: "boolean",
    },
    {
      id: "signedPostmarkAfterIssueDays",
      label: "Signed postmark after issue days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      postmarkDate: value.postmarkDate as string,
      callerVerifiedFirstIssueDate:
        value.callerVerifiedFirstIssueDate as string,
    }),
});
export const run = tool.execute;
export default tool;
