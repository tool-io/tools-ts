import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedStateRecordsWindowKeys: readonly string[];
  readonly callerVerifiedStateRecordsWindowNotices: readonly string[];
  readonly queryStateRecordsWindowKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedStateRecordsWindowKeys",
    label: "Caller verified state records window keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedStateRecordsWindowNotices",
    label: "Caller verified state records window notices",
    kind: "stringList",
  },
  {
    id: "queryStateRecordsWindowKey",
    label: "Query state records window key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedStateRecordsWindowKeys,
      input.callerVerifiedStateRecordsWindowNotices,
      input.queryStateRecordsWindowKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedStateRecordsWindowKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedStateRecordsWindowNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryStateRecordsWindowKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/state-open-records-deadline-variance-lookup",
  title: "State Open Records Deadline Variance Lookup",
  description:
    "Independently verified agency/jurisdiction/date open-records timing notice, not universal state response deadline. Exact independently verified context/edition key; not embedded or live reference data. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerVerifiedStateRecordsWindowKeys:
        value.callerVerifiedStateRecordsWindowKeys as readonly string[],
      callerVerifiedStateRecordsWindowNotices:
        value.callerVerifiedStateRecordsWindowNotices as readonly string[],
      queryStateRecordsWindowKey: value.queryStateRecordsWindowKey as string,
    }),
});
export const run = tool.execute;
export default tool;
