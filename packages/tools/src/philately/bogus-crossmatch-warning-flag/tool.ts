import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedIssueKey: string;
  readonly callerVerifiedBogusIssueKeys: readonly string[];
  readonly callerVerifiedWarningTexts: readonly string[];
}>;
export type Output = Readonly<{
  readonly matchingCallerWarnings: readonly string[];
}>;
const inputFields = [
  { id: "observedIssueKey", label: "Observed issue key", kind: "string" },
  {
    id: "callerVerifiedBogusIssueKeys",
    label: "Caller verified bogus issue keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedWarningTexts",
    label: "Caller verified warning texts",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedBogusIssueKeys,
    input.callerVerifiedWarningTexts,
    "warnings",
  );
  unique(input.callerVerifiedBogusIssueKeys, "list keys");
  if (input.callerVerifiedWarningTexts.some((v) => !v.trim()))
    simpleError(
      "warnings",
      "Nonempty independently verified warnings required.",
    );
  return {
    matchingCallerWarnings: input.callerVerifiedWarningTexts.filter(
      (_, i) =>
        input.callerVerifiedBogusIssueKeys[i] === input.observedIssueKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIssueKey: "edition-a/territory-a/1",
  callerVerifiedBogusIssueKeys: ["edition-a/territory-a/1"],
  callerVerifiedWarningTexts: ["caller independently verified list warning"],
} satisfies Input;
export const exampleOutput = {
  matchingCallerWarnings: ["caller independently verified list warning"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/bogus-crossmatch-warning-flag",
  title: "Bogus List Cross-Match Warning Flag Generator",
  description:
    "Exact cross-match to supplied independently verified bogus-issue list; absence is not evidence of authenticity. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchingCallerWarnings",
      label: "Matching caller warnings",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIssueKey: value.observedIssueKey as string,
      callerVerifiedBogusIssueKeys:
        value.callerVerifiedBogusIssueKeys as readonly string[],
      callerVerifiedWarningTexts:
        value.callerVerifiedWarningTexts as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
