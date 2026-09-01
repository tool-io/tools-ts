import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  unique,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly crushStationIds: readonly string[];
  readonly measuredStationTonnesPerProductiveHour: readonly number[];
  readonly callerDailyProductiveHours: readonly number[];
  readonly callerDailyIncomingTonnes: number;
}>;
export type Output = Readonly<{
  readonly modeledDailyStationCapacityTonnes: readonly number[];
  readonly modeledDailySerialLineCapacityTonnes: number;
  readonly bottleneckStationIds: readonly string[];
  readonly incomingTonnesAboveModeledLineBudget: number;
}>;
const inputFields = [
  { id: "crushStationIds", label: "Crush station ids", kind: "stringList" },
  {
    id: "measuredStationTonnesPerProductiveHour",
    label: "Measured station tonnes per productive hour",
    kind: "numberList",
  },
  {
    id: "callerDailyProductiveHours",
    label: "Caller daily productive hours",
    kind: "numberList",
  },
  {
    id: "callerDailyIncomingTonnes",
    label: "Caller daily incoming tonnes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredStationTonnesPerProductiveHour.forEach((v) =>
    positive(v, "measuredStationTonnesPerProductiveHour"),
  );
  input.callerDailyProductiveHours.forEach((v) =>
    nonnegative(v, "callerDailyProductiveHours"),
  );
  nonnegative(input.callerDailyIncomingTonnes, "callerDailyIncomingTonnes");
  aligned(
    input.crushStationIds,
    input.measuredStationTonnesPerProductiveHour,
    "crushStationIds",
  );
  aligned(
    input.crushStationIds,
    input.callerDailyProductiveHours,
    "crushStationIds",
  );
  unique(input.crushStationIds, "stations");
  if (input.callerDailyProductiveHours.some((v) => v > 24))
    simpleError("hours", "Productive hours per station/day at most 24.");
  const capacity = input.measuredStationTonnesPerProductiveHour.map(
      (v, i) => v * input.callerDailyProductiveHours[i],
    ),
    limit = Math.min(...capacity);
  return {
    modeledDailyStationCapacityTonnes: capacity,
    modeledDailySerialLineCapacityTonnes: limit,
    bottleneckStationIds: input.crushStationIds.filter(
      (_, i) => capacity[i] === limit,
    ),
    incomingTonnesAboveModeledLineBudget: Math.max(
      0,
      input.callerDailyIncomingTonnes - limit,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  crushStationIds: ["receive", "destem", "press"],
  measuredStationTonnesPerProductiveHour: [10, 8, 5],
  callerDailyProductiveHours: [8, 6, 8],
  callerDailyIncomingTonnes: 50,
} satisfies Input;
export const exampleOutput = {
  modeledDailyStationCapacityTonnes: [80, 48, 40],
  modeledDailySerialLineCapacityTonnes: 40,
  bottleneckStationIds: ["press"],
  incomingTonnesAboveModeledLineBudget: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/crush-pad-throughput-tonnes-day",
  title: "Crush Pad Throughput Tonnes Day Calculator",
  description:
    "Audit actual serial crush-pad stage daily capacities and all tied bottlenecks from measured rates/scheduled productive hours; buffers, startup dependencies, batch yields and queuing excluded, no guaranteed output.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledDailyStationCapacityTonnes",
      label: "Modeled daily station capacity tonnes",
      kind: "numberList",
    },
    {
      id: "modeledDailySerialLineCapacityTonnes",
      label: "Modeled daily serial line capacity tonnes",
      kind: "number",
    },
    {
      id: "bottleneckStationIds",
      label: "Bottleneck station ids",
      kind: "stringList",
    },
    {
      id: "incomingTonnesAboveModeledLineBudget",
      label: "Incoming tonnes above modeled line budget",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      crushStationIds: value.crushStationIds as readonly string[],
      measuredStationTonnesPerProductiveHour:
        value.measuredStationTonnesPerProductiveHour as readonly number[],
      callerDailyProductiveHours:
        value.callerDailyProductiveHours as readonly number[],
      callerDailyIncomingTonnes: value.callerDailyIncomingTonnes as number,
    }),
});
export const run = tool.execute;
export default tool;
