import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedTractionMetricStageKeys: readonly string[];
  readonly callerVerifiedTractionMetricStageNotices: readonly string[];
  readonly queryTractionMetricStageKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedTractionMetricStageKeys",
    label: "Caller verified traction metric stage keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedTractionMetricStageNotices",
    label: "Caller verified traction metric stage notices",
    kind: "stringList",
  },
  {
    id: "queryTractionMetricStageKey",
    label: "Query traction metric stage key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedTractionMetricStageKeys,
      input.callerVerifiedTractionMetricStageNotices,
      input.queryTractionMetricStageKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedTractionMetricStageKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedTractionMetricStageNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryTractionMetricStageKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/traction-slide-metrics-stage-guide-lookup",
  title: "Traction Slide Metrics Stage Guide Lookup",
  description:
    "Caller independently verified stage/company-model metric presentation reference. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedTractionMetricStageKeys:
        value.callerVerifiedTractionMetricStageKeys as readonly string[],
      callerVerifiedTractionMetricStageNotices:
        value.callerVerifiedTractionMetricStageNotices as readonly string[],
      queryTractionMetricStageKey: value.queryTractionMetricStageKey as string,
    }),
});
export const run = tool.execute;
export default tool;
