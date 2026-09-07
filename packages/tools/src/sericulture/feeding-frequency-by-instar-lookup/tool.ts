import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFeedingFrequencyKeys: readonly string[];
  readonly callerVerifiedFeedingFrequencyNotices: readonly string[];
  readonly queryFeedingFrequencyKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedFeedingFrequencyKeys",
    label: "Caller verified feeding frequency keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFeedingFrequencyNotices",
    label: "Caller verified feeding frequency notices",
    kind: "stringList",
  },
  {
    id: "queryFeedingFrequencyKey",
    label: "Query feeding frequency key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedFeedingFrequencyKeys,
      input.callerVerifiedFeedingFrequencyNotices,
      input.queryFeedingFrequencyKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFeedingFrequencyKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedFeedingFrequencyNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryFeedingFrequencyKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/feeding-frequency-by-instar-lookup",
  title: "Feeding Frequency By Instar Lookup",
  description:
    "Caller independently verified strain/instar/leaf feeding-frequency schedule notice, no universal frequency or growth guarantee. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies strain, stage, protocol and evidence; not disease-free, biological adequacy or process-safety certification.",
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
      callerVerifiedFeedingFrequencyKeys:
        value.callerVerifiedFeedingFrequencyKeys as readonly string[],
      callerVerifiedFeedingFrequencyNotices:
        value.callerVerifiedFeedingFrequencyNotices as readonly string[],
      queryFeedingFrequencyKey: value.queryFeedingFrequencyKey as string,
    }),
});
export const run = tool.execute;
export default tool;
