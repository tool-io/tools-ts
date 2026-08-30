import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  maximum,
} from "../shared.js";
export type Input = Readonly<{
  readonly arrivalsByInterval: readonly number[];
  readonly departuresByInterval: readonly number[];
  readonly initialVisitorCount: number;
  readonly callerComfortOccupancy: number;
}>;
export type Output = Readonly<{
  readonly visitorCountsAfterIntervals: readonly number[];
  readonly peakObservedOccupancy: number;
  readonly peakToCallerComfortIndex: number;
}>;
const inputFields = [
  {
    id: "arrivalsByInterval",
    label: "Arrivals by interval",
    kind: "numberList",
  },
  {
    id: "departuresByInterval",
    label: "Departures by interval",
    kind: "numberList",
  },
  {
    id: "initialVisitorCount",
    label: "Initial visitor count",
    kind: "integer",
  },
  {
    id: "callerComfortOccupancy",
    label: "Caller comfort occupancy",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerComfortOccupancy, "callerComfortOccupancy");
  input.arrivalsByInterval.forEach((v) => count(v, "arrivalsByInterval"));
  input.departuresByInterval.forEach((v) => count(v, "departuresByInterval"));
  count(input.initialVisitorCount, "initialVisitorCount");
  aligned(
    input.arrivalsByInterval,
    input.departuresByInterval,
    "arrivalsByInterval",
  );
  let n = input.initialVisitorCount;
  const c = input.arrivalsByInterval.map(
    (v, i) => (n = count(n + v - input.departuresByInterval[i], "occupancy")),
  );
  const peak = Math.max(input.initialVisitorCount, maximum(c));
  return {
    visitorCountsAfterIntervals: c,
    peakObservedOccupancy: peak,
    peakToCallerComfortIndex: peak / input.callerComfortOccupancy,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  arrivalsByInterval: [10, 20, 5],
  departuresByInterval: [5, 10, 10],
  initialVisitorCount: 0,
  callerComfortOccupancy: 15,
} satisfies Input;
export const exampleOutput = {
  visitorCountsAfterIntervals: [5, 15, 10],
  peakObservedOccupancy: 15,
  peakToCallerComfortIndex: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/peak-flow-congestion-index",
  title: "Peak Hour Visitor Flow Congestion Index Calculator",
  description:
    "Reconstruct observed interval-boundary visitor inventory from separate arrivals/departures and compare caller comfort occupancy; no hidden Little’s-law steady state, within-interval peak, fire-code approval or crowd safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "visitorCountsAfterIntervals",
      label: "Visitor counts after intervals",
      kind: "numberList",
    },
    {
      id: "peakObservedOccupancy",
      label: "Peak observed occupancy",
      kind: "number",
    },
    {
      id: "peakToCallerComfortIndex",
      label: "Peak to caller comfort index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      arrivalsByInterval: value.arrivalsByInterval as readonly number[],
      departuresByInterval: value.departuresByInterval as readonly number[],
      initialVisitorCount: value.initialVisitorCount as number,
      callerComfortOccupancy: value.callerComfortOccupancy as number,
    }),
});
export const run = tool.execute;
export default tool;
