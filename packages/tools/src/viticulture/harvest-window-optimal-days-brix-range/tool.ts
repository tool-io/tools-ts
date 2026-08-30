import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly observationDayOrdinals: readonly number[];
  readonly observedBrix: readonly number[];
  readonly callerBrixAcceptableRange: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleHarvestWindowDayBounds: readonly (readonly number[])[];
  readonly totalContinuousCompatibleDays: number;
}>;
const inputFields = [
  {
    id: "observationDayOrdinals",
    label: "Observation day ordinals",
    kind: "numberList",
  },
  { id: "observedBrix", label: "Observed brix", kind: "numberList" },
  {
    id: "callerBrixAcceptableRange",
    label: "Caller brix acceptable range",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBrix.forEach((v) => nonnegative(v, "observedBrix"));
  ordered(input.observationDayOrdinals, "days");
  aligned(input.observationDayOrdinals, input.observedBrix, "observations");
  if (
    input.callerBrixAcceptableRange.length !== 2 ||
    input.callerBrixAcceptableRange[0] > input.callerBrixAcceptableRange[1]
  )
    simpleError("range", "Ordered caller acceptable Brix interval required.");
  const [lo, hi] = input.callerBrixAcceptableRange,
    windows: number[][] = [];
  for (let i = 1; i < input.observationDayOrdinals.length; i++) {
    const a = input.observedBrix[i - 1],
      b = input.observedBrix[i],
      t = input.observationDayOrdinals[i - 1],
      dt = input.observationDayOrdinals[i] - t;
    let x = 0,
      y = 1;
    if (a === b) {
      if (a < lo || a > hi) continue;
    } else {
      const u = (lo - a) / (b - a),
        v = (hi - a) / (b - a);
      x = Math.max(0, Math.min(u, v));
      y = Math.min(1, Math.max(u, v));
      if (y < x) continue;
    }
    const start = t + dt * x,
      end = t + dt * y;
    if (windows.length && windows.at(-1)![1] === start)
      windows.at(-1)![1] = end;
    else {
      if (windows.length === 128)
        simpleError(
          "windows",
          "At most 128 disconnected model-compatible windows.",
        );
      windows.push([start, end]);
    }
  }
  if (windows.length > 128)
    simpleError(
      "windows",
      "At most 128 disconnected model-compatible windows.",
    );
  return {
    compatibleHarvestWindowDayBounds: windows,
    totalContinuousCompatibleDays: windows.reduce((s, w) => s + w[1] - w[0], 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observationDayOrdinals: [100, 102, 105, 106],
  observedBrix: [10, 15, 20, 22],
  callerBrixAcceptableRange: [14, 21],
} satisfies Input;
export const exampleOutput = {
  compatibleHarvestWindowDayBounds: [[101.6, 105.5]],
  totalContinuousCompatibleDays: 3.9,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/harvest-window-optimal-days-brix-range",
  title: "Harvest Window Optimal Days Brix Range Finder",
  description:
    "Find all piecewise-linear observed Brix-compatible intervals under caller range, retaining disconnected/reversed trajectories and boundaries; sugar compatibility alone is not optimal harvest, maturity, acid balance or validated future scheduling.",
  inputs: inputFields,
  outputs: [
    {
      id: "compatibleHarvestWindowDayBounds",
      label: "Compatible harvest window day bounds",
      kind: "matrix",
    },
    {
      id: "totalContinuousCompatibleDays",
      label: "Total continuous compatible days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observationDayOrdinals: value.observationDayOrdinals as readonly number[],
      observedBrix: value.observedBrix as readonly number[],
      callerBrixAcceptableRange:
        value.callerBrixAcceptableRange as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
