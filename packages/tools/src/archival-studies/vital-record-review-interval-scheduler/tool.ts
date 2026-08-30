import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly lastVitalRecordReviewOrdinals: readonly number[];
  readonly callerReviewIntervalsDays: readonly number[];
  readonly asOfDayOrdinal: number;
  readonly callerAdvanceAlertDays: number;
}>;
export type Output = Readonly<{
  readonly vitalReviewOverdueDays: readonly number[];
  readonly dueOrAdvanceAlertIndices: readonly number[];
  readonly nextPolicyReviewOrdinals: readonly number[];
}>;
const inputFields = [
  {
    id: "lastVitalRecordReviewOrdinals",
    label: "Last vital record review ordinals",
    kind: "numberList",
  },
  {
    id: "callerReviewIntervalsDays",
    label: "Caller review intervals days",
    kind: "numberList",
  },
  { id: "asOfDayOrdinal", label: "As of day ordinal", kind: "integer" },
  {
    id: "callerAdvanceAlertDays",
    label: "Caller advance alert days",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerReviewIntervalsDays.forEach((v) =>
    positive(v, "callerReviewIntervalsDays"),
  );
  input.lastVitalRecordReviewOrdinals.forEach((v) =>
    count(v, "lastVitalRecordReviewOrdinals"),
  );
  input.callerReviewIntervalsDays.forEach((v) =>
    count(v, "callerReviewIntervalsDays"),
  );
  count(input.asOfDayOrdinal, "asOfDayOrdinal");
  count(input.callerAdvanceAlertDays, "callerAdvanceAlertDays");
  aligned(
    input.lastVitalRecordReviewOrdinals,
    input.callerReviewIntervalsDays,
    "lastVitalRecordReviewOrdinals",
  );
  if (input.lastVitalRecordReviewOrdinals.some((v) => v > input.asOfDayOrdinal))
    simpleError("review", "Observed reviews cannot be future.");
  const next = input.lastVitalRecordReviewOrdinals.map((v, i) =>
    count(v + input.callerReviewIntervalsDays[i], "next"),
  );
  return {
    vitalReviewOverdueDays: next.map((v) =>
      Math.max(0, input.asOfDayOrdinal - v),
    ),
    dueOrAdvanceAlertIndices: next.flatMap((v, i) =>
      v - input.asOfDayOrdinal <= input.callerAdvanceAlertDays ? [i] : [],
    ),
    nextPolicyReviewOrdinals: next,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lastVitalRecordReviewOrdinals: [10, 20],
  callerReviewIntervalsDays: [5, 10],
  asOfDayOrdinal: 26,
  callerAdvanceAlertDays: 5,
} satisfies Input;
export const exampleOutput = {
  vitalReviewOverdueDays: [11, 0],
  dueOrAdvanceAlertIndices: [0, 1],
  nextPolicyReviewOrdinals: [15, 30],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/vital-record-review-interval-scheduler",
  title: "Vital Record Review Cycle Interval Scheduler",
  description:
    "Schedule vital-record review with explicit advance-alert window and overdue exposure; unlike inspection cadence, imminent reviews are separately flagged, not a statutory review rule.",
  inputs: inputFields,
  outputs: [
    {
      id: "vitalReviewOverdueDays",
      label: "Vital review overdue days",
      kind: "numberList",
    },
    {
      id: "dueOrAdvanceAlertIndices",
      label: "Due or advance alert indices",
      kind: "numberList",
    },
    {
      id: "nextPolicyReviewOrdinals",
      label: "Next policy review ordinals",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      lastVitalRecordReviewOrdinals:
        value.lastVitalRecordReviewOrdinals as readonly number[],
      callerReviewIntervalsDays:
        value.callerReviewIntervalsDays as readonly number[],
      asOfDayOrdinal: value.asOfDayOrdinal as number,
      callerAdvanceAlertDays: value.callerAdvanceAlertDays as number,
    }),
});
export const run = tool.execute;
export default tool;
