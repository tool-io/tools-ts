import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  binary,
  unique,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly alertIds: readonly string[];
  readonly observedAlertAgesDays: readonly number[];
  readonly resolvedFlags: readonly number[];
  readonly callerReviewAgeThresholdDays: number;
}>;
export type Output = Readonly<{
  readonly unresolvedAlertCount: number;
  readonly agedUnresolvedAlertIds: readonly string[];
  readonly oldestUnresolvedAgeDays: number;
}>;
const inputFields = [
  { id: "alertIds", label: "Alert ids", kind: "stringList" },
  {
    id: "observedAlertAgesDays",
    label: "Observed alert ages days",
    kind: "numberList",
  },
  { id: "resolvedFlags", label: "Resolved flags", kind: "numberList" },
  {
    id: "callerReviewAgeThresholdDays",
    label: "Caller review age threshold days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.resolvedFlags, "resolvedFlags");
  aligned(input.alertIds, input.observedAlertAgesDays, "alertIds");
  aligned(input.alertIds, input.resolvedFlags, "alertIds");
  unique(input.alertIds, "alerts");
  bounded(input.callerReviewAgeThresholdDays, "threshold", 0, 36600);
  input.observedAlertAgesDays.forEach((v) => bounded(v, "age", 0, 36600));
  const unresolved = input.observedAlertAgesDays.filter(
    (_, i) => !input.resolvedFlags[i],
  );
  return {
    unresolvedAlertCount: unresolved.length,
    agedUnresolvedAlertIds: input.alertIds.filter(
      (_, i) =>
        !input.resolvedFlags[i] &&
        input.observedAlertAgesDays[i] >= input.callerReviewAgeThresholdDays,
    ),
    oldestUnresolvedAgeDays: unresolved.length ? Math.max(...unresolved) : -1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  alertIds: ["A", "B"],
  observedAlertAgesDays: [10, 30],
  resolvedFlags: [0, 0],
  callerReviewAgeThresholdDays: 20,
} satisfies Input;
export const exampleOutput = {
  unresolvedAlertCount: 2,
  agedUnresolvedAlertIds: ["B"],
  oldestUnresolvedAgeDays: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/alert-backlog-aging-checker",
  title: "Alert Backlog Aging Checker",
  description:
    "Audit actual alert backlog/age under caller inclusive review threshold, retaining absent unresolved evidence with −1; not suspicious-activity reporting deadlines, risk judgment or legal compliance certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "unresolvedAlertCount",
      label: "Unresolved alert count",
      kind: "number",
    },
    {
      id: "agedUnresolvedAlertIds",
      label: "Aged unresolved alert ids",
      kind: "stringList",
    },
    {
      id: "oldestUnresolvedAgeDays",
      label: "Oldest unresolved age days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      alertIds: value.alertIds as readonly string[],
      observedAlertAgesDays: value.observedAlertAgesDays as readonly number[],
      resolvedFlags: value.resolvedFlags as readonly number[],
      callerReviewAgeThresholdDays:
        value.callerReviewAgeThresholdDays as number,
    }),
});
export const run = tool.execute;
export default tool;
