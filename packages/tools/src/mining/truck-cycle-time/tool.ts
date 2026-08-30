import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly segmentDistancesKm: readonly number[];
  readonly loadedSpeedsKmPerHour: readonly number[];
  readonly emptySpeedsKmPerHour: readonly number[];
  readonly loadingMinutes: number;
  readonly dumpMinutes: number;
  readonly queueMinutes: number;
}>;
export type Output = Readonly<{
  readonly loadedTravelMinutes: number;
  readonly emptyTravelMinutes: number;
  readonly totalCycleMinutes: number;
}>;
const inputFields = [
  {
    id: "segmentDistancesKm",
    label: "Segment distances km",
    kind: "numberList",
  },
  {
    id: "loadedSpeedsKmPerHour",
    label: "Loaded speeds km per hour",
    kind: "numberList",
  },
  {
    id: "emptySpeedsKmPerHour",
    label: "Empty speeds km per hour",
    kind: "numberList",
  },
  { id: "loadingMinutes", label: "Loading minutes", kind: "number" },
  { id: "dumpMinutes", label: "Dump minutes", kind: "number" },
  { id: "queueMinutes", label: "Queue minutes", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.loadedSpeedsKmPerHour.forEach((v) =>
    positive(v, "loadedSpeedsKmPerHour"),
  );
  input.emptySpeedsKmPerHour.forEach((v) =>
    positive(v, "emptySpeedsKmPerHour"),
  );
  input.segmentDistancesKm.forEach((v) => nonnegative(v, "segmentDistancesKm"));
  nonnegative(input.loadingMinutes, "loadingMinutes");
  nonnegative(input.dumpMinutes, "dumpMinutes");
  nonnegative(input.queueMinutes, "queueMinutes");
  aligned(
    input.segmentDistancesKm,
    input.loadedSpeedsKmPerHour,
    "segmentDistancesKm",
  );
  aligned(
    input.segmentDistancesKm,
    input.emptySpeedsKmPerHour,
    "segmentDistancesKm",
  );
  const loadedTravelMinutes =
      60 *
      input.segmentDistancesKm.reduce(
        (s, v, i) => s + v / input.loadedSpeedsKmPerHour[i],
        0,
      ),
    emptyTravelMinutes =
      60 *
      input.segmentDistancesKm.reduce(
        (s, v, i) => s + v / input.emptySpeedsKmPerHour[i],
        0,
      );
  return {
    loadedTravelMinutes,
    emptyTravelMinutes,
    totalCycleMinutes:
      loadedTravelMinutes +
      emptyTravelMinutes +
      input.loadingMinutes +
      input.dumpMinutes +
      input.queueMinutes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  segmentDistancesKm: [1, 2],
  loadedSpeedsKmPerHour: [10, 20],
  emptySpeedsKmPerHour: [20, 40],
  loadingMinutes: 3,
  dumpMinutes: 1,
  queueMinutes: 2,
} satisfies Input;
export const exampleOutput = {
  loadedTravelMinutes: 12,
  emptyTravelMinutes: 6,
  totalCycleMinutes: 24,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/truck-cycle-time",
  title: "Truck Cycle Time",
  description:
    "Sum loaded/empty segment travel and service/queue times; speed profiles are inputs, not traction predictions.",
  inputs: inputFields,
  outputs: [
    {
      id: "loadedTravelMinutes",
      label: "Loaded travel minutes",
      kind: "number",
    },
    { id: "emptyTravelMinutes", label: "Empty travel minutes", kind: "number" },
    { id: "totalCycleMinutes", label: "Total cycle minutes", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      segmentDistancesKm: value.segmentDistancesKm as readonly number[],
      loadedSpeedsKmPerHour: value.loadedSpeedsKmPerHour as readonly number[],
      emptySpeedsKmPerHour: value.emptySpeedsKmPerHour as readonly number[],
      loadingMinutes: value.loadingMinutes as number,
      dumpMinutes: value.dumpMinutes as number,
      queueMinutes: value.queueMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
