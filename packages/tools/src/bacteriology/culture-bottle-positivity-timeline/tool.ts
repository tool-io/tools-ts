import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly bottleIds: readonly string[];
  readonly incubationStartHours: readonly number[];
  readonly alarmHours: readonly number[];
  readonly evaluationHour: number;
  readonly maximumAlarmDelayHours: number;
}>;
export type Output = Readonly<{
  readonly positiveBottleIds: readonly string[];
  readonly positivityDelaysHours: readonly number[];
  readonly noAlarmBottleIds: readonly string[];
  readonly delayedPositiveBottleIds: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  aligned(input.bottleIds, input.incubationStartHours, "bottleIds");
  aligned(input.bottleIds, input.alarmHours, "bottleIds");
  nonnegative(input.evaluationHour, "evaluationHour");
  nonnegative(input.maximumAlarmDelayHours, "maximumAlarmDelayHours");
  if (
    new Set(input.bottleIds).size !== input.bottleIds.length ||
    input.incubationStartHours.some(
      (v, i) =>
        v < 0 ||
        v > input.evaluationHour ||
        (input.alarmHours[i] !== -1 &&
          (input.alarmHours[i] < v ||
            input.alarmHours[i] > input.evaluationHour)),
    )
  )
    simpleError(
      "alarmHours",
      "Distinct bottles with chronological incubation/alarm times required; -1 means no alarm yet.",
    );
  const indexes = input.alarmHours.flatMap((v, i) => (v === -1 ? [] : [i])),
    positiveBottleIds = indexes.map((i) => input.bottleIds[i]),
    positivityDelaysHours = indexes.map(
      (i) => input.alarmHours[i] - input.incubationStartHours[i],
    );
  return {
    positiveBottleIds,
    positivityDelaysHours,
    noAlarmBottleIds: input.bottleIds.filter(
      (_, i) => input.alarmHours[i] === -1,
    ),
    delayedPositiveBottleIds: positiveBottleIds.filter(
      (_, i) => positivityDelaysHours[i] > input.maximumAlarmDelayHours,
    ),
  };
};
export const exampleInput = {
  bottleIds: ["A", "B", "C"],
  incubationStartHours: [0, 1, 2],
  alarmHours: [5, -1, 10],
  evaluationHour: 12,
  maximumAlarmDelayHours: 6,
} satisfies Input;
export const exampleOutput = {
  positiveBottleIds: ["A", "C"],
  positivityDelaysHours: [5, 8],
  noAlarmBottleIds: ["B"],
  delayedPositiveBottleIds: ["C"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/culture-bottle-positivity-timeline",
  title: "Culture Bottle Positivity Timeline",
  description:
    "Track culture alarm delays and still-unalarmed bottles using explicit observation time; alarm timing alone does not identify contamination.",
  inputs: [
    { id: "bottleIds", label: "Bottle ids", kind: "stringList" },
    {
      id: "incubationStartHours",
      label: "Incubation start hours",
      kind: "numberList",
    },
    { id: "alarmHours", label: "Alarm hours", kind: "numberList" },
    {
      id: "evaluationHour",
      label: "Evaluation hour",
      kind: "number",
      minimum: 0,
    },
    {
      id: "maximumAlarmDelayHours",
      label: "Maximum alarm delay hours",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "positiveBottleIds",
      label: "Positive bottle ids",
      kind: "stringList",
    },
    {
      id: "positivityDelaysHours",
      label: "Positivity delays hours",
      kind: "numberList",
    },
    {
      id: "noAlarmBottleIds",
      label: "No alarm bottle ids",
      kind: "stringList",
    },
    {
      id: "delayedPositiveBottleIds",
      label: "Delayed positive bottle ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      bottleIds: value.bottleIds as readonly string[],
      incubationStartHours: value.incubationStartHours as readonly number[],
      alarmHours: value.alarmHours as readonly number[],
      evaluationHour: value.evaluationHour as number,
      maximumAlarmDelayHours: value.maximumAlarmDelayHours as number,
    }),
});
export const run = tool.execute;
export default tool;
