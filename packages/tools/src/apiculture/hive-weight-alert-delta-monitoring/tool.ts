import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly timesDays: readonly number[];
  readonly hiveWeightsKg: readonly number[];
  readonly intervalNetExternalMassChangesKg: readonly number[];
  readonly absoluteAlertDeltaKg: number;
}>;
export type Output = Readonly<{
  readonly correctedIntervalDeltasKg: readonly number[];
  readonly correctedRatesKgPerDay: readonly number[];
  readonly alertIntervalFlags: readonly number[];
}>;
const inputFields = [
  { id: "timesDays", label: "Times days", kind: "numberList" },
  { id: "hiveWeightsKg", label: "Hive weights kg", kind: "numberList" },
  {
    id: "intervalNetExternalMassChangesKg",
    label: "Interval net external mass changes kg",
    kind: "numberList",
  },
  {
    id: "absoluteAlertDeltaKg",
    label: "Absolute alert delta kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.hiveWeightsKg.forEach((v) => nonnegative(v, "hiveWeightsKg"));
  nonnegative(input.absoluteAlertDeltaKg, "absoluteAlertDeltaKg");
  aligned(input.timesDays, input.hiveWeightsKg, "timesDays");
  ordered(input.timesDays, "timesDays");
  aligned(
    input.timesDays.slice(1),
    input.intervalNetExternalMassChangesKg,
    "intervalNetExternalMassChangesKg",
  );
  const correctedIntervalDeltasKg = input.hiveWeightsKg
    .slice(1)
    .map(
      (v, i) =>
        v - input.hiveWeightsKg[i] - input.intervalNetExternalMassChangesKg[i],
    );
  return {
    correctedIntervalDeltasKg,
    correctedRatesKgPerDay: correctedIntervalDeltasKg.map(
      (v, i) => v / (input.timesDays[i + 1] - input.timesDays[i]),
    ),
    alertIntervalFlags: correctedIntervalDeltasKg.map((v) =>
      Math.abs(v) > input.absoluteAlertDeltaKg ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesDays: [0, 1, 2],
  hiveWeightsKg: [10, 12, 10],
  intervalNetExternalMassChangesKg: [1, -1],
  absoluteAlertDeltaKg: 0.5,
} satisfies Input;
export const exampleOutput = {
  correctedIntervalDeltasKg: [1, -1],
  correctedRatesKgPerDay: [1, -1],
  alertIntervalFlags: [1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/hive-weight-alert-delta-monitoring",
  title: "Hive Weight Alert Delta Monitoring",
  description:
    "Monitor interval hive-weight changes after supplied external loading/removal corrections against caller strict delta threshold; not automatic swarm, forage or theft identification.",
  inputs: inputFields,
  outputs: [
    {
      id: "correctedIntervalDeltasKg",
      label: "Corrected interval deltas kg",
      kind: "numberList",
    },
    {
      id: "correctedRatesKgPerDay",
      label: "Corrected rates kg per day",
      kind: "numberList",
    },
    {
      id: "alertIntervalFlags",
      label: "Alert interval flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      timesDays: value.timesDays as readonly number[],
      hiveWeightsKg: value.hiveWeightsKg as readonly number[],
      intervalNetExternalMassChangesKg:
        value.intervalNetExternalMassChangesKg as readonly number[],
      absoluteAlertDeltaKg: value.absoluteAlertDeltaKg as number,
    }),
});
export const run = tool.execute;
export default tool;
