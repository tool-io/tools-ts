import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedIncubationConditionTableKeys: readonly string[];
  readonly callerVerifiedIncubationConditionTableNotices: readonly string[];
  readonly queryIncubationConditionTableKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedIncubationConditionTableKeys",
    label: "Caller verified incubation condition table keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedIncubationConditionTableNotices",
    label: "Caller verified incubation condition table notices",
    kind: "stringList",
  },
  {
    id: "queryIncubationConditionTableKey",
    label: "Query incubation condition table key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedIncubationConditionTableKeys,
      input.callerVerifiedIncubationConditionTableNotices,
      input.queryIncubationConditionTableKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedIncubationConditionTableKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedIncubationConditionTableNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryIncubationConditionTableKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/incubation-days-temp-humidity-table",
  title: "Incubation Days Temp Humidity Table Lookup",
  description:
    "Independently verified strain/egg-treatment/day/temperature/RH incubation table notice; no incubation setting prescribed. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies strain, stage, protocol and evidence; not disease-free, biological adequacy or process-safety certification.",
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
      callerVerifiedIncubationConditionTableKeys:
        value.callerVerifiedIncubationConditionTableKeys as readonly string[],
      callerVerifiedIncubationConditionTableNotices:
        value.callerVerifiedIncubationConditionTableNotices as readonly string[],
      queryIncubationConditionTableKey:
        value.queryIncubationConditionTableKey as string,
    }),
});
export const run = tool.execute;
export default tool;
