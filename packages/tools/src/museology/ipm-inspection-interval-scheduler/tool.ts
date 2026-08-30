import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly lastInspectionDayOrdinals: readonly number[];
  readonly callerInspectionIntervalsDays: readonly number[];
  readonly asOfDayOrdinal: number;
}>;
export type Output = Readonly<{
  readonly nextCallerInspectionOrdinals: readonly number[];
  readonly signedDaysUntilInspection: readonly number[];
  readonly overdueInspectionFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "lastInspectionDayOrdinals",
    label: "Last inspection day ordinals",
    kind: "numberList",
  },
  {
    id: "callerInspectionIntervalsDays",
    label: "Caller inspection intervals days",
    kind: "numberList",
  },
  { id: "asOfDayOrdinal", label: "As of day ordinal", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerInspectionIntervalsDays.forEach((v) =>
    positive(v, "callerInspectionIntervalsDays"),
  );
  input.lastInspectionDayOrdinals.forEach((v) =>
    count(v, "lastInspectionDayOrdinals"),
  );
  input.callerInspectionIntervalsDays.forEach((v) =>
    count(v, "callerInspectionIntervalsDays"),
  );
  count(input.asOfDayOrdinal, "asOfDayOrdinal");
  aligned(
    input.lastInspectionDayOrdinals,
    input.callerInspectionIntervalsDays,
    "lastInspectionDayOrdinals",
  );
  if (input.lastInspectionDayOrdinals.some((v) => v > input.asOfDayOrdinal))
    simpleError("inspection", "Last inspection cannot be future.");
  const n = input.lastInspectionDayOrdinals.map((v, i) =>
    count(v + input.callerInspectionIntervalsDays[i], "nextInspection"),
  );
  return {
    nextCallerInspectionOrdinals: n,
    signedDaysUntilInspection: n.map((v) => v - input.asOfDayOrdinal),
    overdueInspectionFlags: n.map((v) => (v < input.asOfDayOrdinal ? 1 : 0)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lastInspectionDayOrdinals: [10, 20],
  callerInspectionIntervalsDays: [5, 10],
  asOfDayOrdinal: 26,
} satisfies Input;
export const exampleOutput = {
  nextCallerInspectionOrdinals: [15, 30],
  signedDaysUntilInspection: [-11, 4],
  overdueInspectionFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/ipm-inspection-interval-scheduler",
  title: "Integrated Pest Monitoring Inspection Interval Scheduler",
  description:
    "Schedule caller IPM inspection cadence from actual last events on continuous day ordinals, retaining overdue sign; no recommended monitoring interval or pest-free guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "nextCallerInspectionOrdinals",
      label: "Next caller inspection ordinals",
      kind: "numberList",
    },
    {
      id: "signedDaysUntilInspection",
      label: "Signed days until inspection",
      kind: "numberList",
    },
    {
      id: "overdueInspectionFlags",
      label: "Overdue inspection flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      lastInspectionDayOrdinals:
        value.lastInspectionDayOrdinals as readonly number[],
      callerInspectionIntervalsDays:
        value.callerInspectionIntervalsDays as readonly number[],
      asOfDayOrdinal: value.asOfDayOrdinal as number,
    }),
});
export const run = tool.execute;
export default tool;
