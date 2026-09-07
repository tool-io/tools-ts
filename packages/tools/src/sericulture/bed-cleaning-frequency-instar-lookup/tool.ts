import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedBedCleaningScheduleKeys: readonly string[];
  readonly callerVerifiedBedCleaningScheduleNotices: readonly string[];
  readonly queryBedCleaningScheduleKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedBedCleaningScheduleKeys",
    label: "Caller verified bed cleaning schedule keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedBedCleaningScheduleNotices",
    label: "Caller verified bed cleaning schedule notices",
    kind: "stringList",
  },
  {
    id: "queryBedCleaningScheduleKey",
    label: "Query bed cleaning schedule key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedBedCleaningScheduleKeys,
      input.callerVerifiedBedCleaningScheduleNotices,
      input.queryBedCleaningScheduleKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedBedCleaningScheduleKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedBedCleaningScheduleNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryBedCleaningScheduleKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/bed-cleaning-frequency-instar-lookup",
  title: "Bed Cleaning Frequency Instar Lookup",
  description:
    "Caller independently verified instar/bed/strain cleaning-frequency schedule, no disinfection recipe or disease-control claim. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies strain, stage, protocol and evidence; not disease-free, biological adequacy or process-safety certification.",
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
      callerVerifiedBedCleaningScheduleKeys:
        value.callerVerifiedBedCleaningScheduleKeys as readonly string[],
      callerVerifiedBedCleaningScheduleNotices:
        value.callerVerifiedBedCleaningScheduleNotices as readonly string[],
      queryBedCleaningScheduleKey: value.queryBedCleaningScheduleKey as string,
    }),
});
export const run = tool.execute;
export default tool;
