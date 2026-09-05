import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedQuashDeadlineKeys: readonly string[];
  readonly callerVerifiedQuashDeadlineNotices: readonly string[];
  readonly queryQuashDeadlineKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedQuashDeadlineKeys",
    label: "Caller verified quash deadline keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedQuashDeadlineNotices",
    label: "Caller verified quash deadline notices",
    kind: "stringList",
  },
  {
    id: "queryQuashDeadlineKey",
    label: "Query quash deadline key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedQuashDeadlineKeys,
      input.callerVerifiedQuashDeadlineNotices,
      input.queryQuashDeadlineKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedQuashDeadlineKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedQuashDeadlineNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryQuashDeadlineKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/subpoena-quash-move-deadline-days-lookup",
  title: "Subpoena Quash Move Deadline Days Lookup",
  description:
    "Independently verified court/jurisdiction/service/date subpoena quash deadline notice; no legal filing authorization. Exact independently verified context/edition key; not embedded or live reference data. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerVerifiedQuashDeadlineKeys:
        value.callerVerifiedQuashDeadlineKeys as readonly string[],
      callerVerifiedQuashDeadlineNotices:
        value.callerVerifiedQuashDeadlineNotices as readonly string[],
      queryQuashDeadlineKey: value.queryQuashDeadlineKey as string,
    }),
});
export const run = tool.execute;
export default tool;
