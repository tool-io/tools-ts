import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedInspectionIntervalKeys: readonly string[];
  readonly callerVerifiedInspectionIntervalNotices: readonly string[];
  readonly queryInspectionIntervalKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedInspectionIntervalKeys",
    label: "Caller verified inspection interval keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedInspectionIntervalNotices",
    label: "Caller verified inspection interval notices",
    kind: "stringList",
  },
  {
    id: "queryInspectionIntervalKey",
    label: "Query inspection interval key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedInspectionIntervalKeys,
      input.callerVerifiedInspectionIntervalNotices,
      input.queryInspectionIntervalKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedInspectionIntervalKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedInspectionIntervalNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryInspectionIntervalKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/inspection-calendar-interval-by-season",
  title: "Inspection Calendar Interval By Season Lookup",
  description:
    "Caller independently verified season/site/management inspection interval policy; no live weather or swarm prediction. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerVerifiedInspectionIntervalKeys:
        value.callerVerifiedInspectionIntervalKeys as readonly string[],
      callerVerifiedInspectionIntervalNotices:
        value.callerVerifiedInspectionIntervalNotices as readonly string[],
      queryInspectionIntervalKey: value.queryInspectionIntervalKey as string,
    }),
});
export const run = tool.execute;
export default tool;
