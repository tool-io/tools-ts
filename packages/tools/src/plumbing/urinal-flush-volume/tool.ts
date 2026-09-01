import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedUrinalFlushVolumeLiters: number;
  readonly observedOccupancyTriggeredFlushes: number;
  readonly observedScheduledPurgeFlushes: number;
  readonly observedContinuousLeakLitersHour: number;
  readonly observedWindowHours: number;
}>;
export type Output = Readonly<{
  readonly observedUrinalFlushLiters: number;
  readonly observedLeakLiters: number;
  readonly totalObservedUrinalWaterLiters: number;
}>;
const inputFields = [
  {
    id: "observedUrinalFlushVolumeLiters",
    label: "Observed urinal flush volume liters",
    kind: "number",
  },
  {
    id: "observedOccupancyTriggeredFlushes",
    label: "Observed occupancy triggered flushes",
    kind: "number",
  },
  {
    id: "observedScheduledPurgeFlushes",
    label: "Observed scheduled purge flushes",
    kind: "number",
  },
  {
    id: "observedContinuousLeakLitersHour",
    label: "Observed continuous leak liters hour",
    kind: "number",
  },
  { id: "observedWindowHours", label: "Observed window hours", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.observedUrinalFlushVolumeLiters,
    "observedUrinalFlushVolumeLiters",
  );
  nonnegative(
    input.observedContinuousLeakLitersHour,
    "observedContinuousLeakLitersHour",
  );
  nonnegative(input.observedWindowHours, "observedWindowHours");
  bounded(input.observedOccupancyTriggeredFlushes, "flushes", 0, 1000000);
  bounded(input.observedScheduledPurgeFlushes, "purges", 0, 1000000);
  const flush =
      input.observedUrinalFlushVolumeLiters *
      (input.observedOccupancyTriggeredFlushes +
        input.observedScheduledPurgeFlushes),
    leak = input.observedContinuousLeakLitersHour * input.observedWindowHours;
  return {
    observedUrinalFlushLiters: flush,
    observedLeakLiters: leak,
    totalObservedUrinalWaterLiters: flush + leak,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedUrinalFlushVolumeLiters: 1,
  observedOccupancyTriggeredFlushes: 10,
  observedScheduledPurgeFlushes: 3,
  observedContinuousLeakLitersHour: 0.5,
  observedWindowHours: 8,
} satisfies Input;
export const exampleOutput = {
  observedUrinalFlushLiters: 13,
  observedLeakLiters: 4,
  totalObservedUrinalWaterLiters: 17,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/urinal-flush-volume",
  title: "Plumbing Urinal Flush Volume Calculator",
  description:
    "Inventory actual urinal occupancy/purge flushes separately from independently measured continuous leak over observation window, no inferred duty policy.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedUrinalFlushLiters",
      label: "Observed urinal flush liters",
      kind: "number",
    },
    { id: "observedLeakLiters", label: "Observed leak liters", kind: "number" },
    {
      id: "totalObservedUrinalWaterLiters",
      label: "Total observed urinal water liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedUrinalFlushVolumeLiters:
        value.observedUrinalFlushVolumeLiters as number,
      observedOccupancyTriggeredFlushes:
        value.observedOccupancyTriggeredFlushes as number,
      observedScheduledPurgeFlushes:
        value.observedScheduledPurgeFlushes as number,
      observedContinuousLeakLitersHour:
        value.observedContinuousLeakLitersHour as number,
      observedWindowHours: value.observedWindowHours as number,
    }),
});
export const run = tool.execute;
export default tool;
