import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, fraction, onset } from "../shared.js";
export type Input = Readonly<{
  readonly timesMs: readonly number[];
  readonly voltagesMv: readonly number[];
  readonly baselineMv: number;
  readonly peakMv: number;
  readonly lowerFraction: number;
  readonly upperFraction: number;
}>;
export type Output = Readonly<{
  readonly lowerCrossingMs: number;
  readonly upperCrossingMs: number;
  readonly riseTimeMs: number;
}>;
const inputFields = [
  { id: "timesMs", label: "Times ms", kind: "numberList" },
  { id: "voltagesMv", label: "Voltages mv", kind: "numberList" },
  { id: "baselineMv", label: "Baseline mv", kind: "number" },
  { id: "peakMv", label: "Peak mv", kind: "number" },
  { id: "lowerFraction", label: "Lower fraction", kind: "number" },
  { id: "upperFraction", label: "Upper fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(input.lowerFraction, "lowerFraction");
  fraction(input.upperFraction, "upperFraction");
  if (
    input.lowerFraction >= input.upperFraction ||
    input.peakMv <= input.baselineMv
  )
    simpleError(
      "upperFraction",
      "Ordered rise fractions and peak above baseline required.",
    );
  const lowerCrossingMs = onset(
      input.timesMs,
      input.voltagesMv,
      input.timesMs[0],
      input.baselineMv +
        input.lowerFraction * (input.peakMv - input.baselineMv),
      1,
    ),
    upperCrossingMs = onset(
      input.timesMs,
      input.voltagesMv,
      lowerCrossingMs,
      input.baselineMv +
        input.upperFraction * (input.peakMv - input.baselineMv),
      1,
    );
  return {
    lowerCrossingMs,
    upperCrossingMs,
    riseTimeMs: upperCrossingMs - lowerCrossingMs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesMs: [0, 1, 2, 3],
  voltagesMv: [-70, -60, 20, 30],
  baselineMv: -70,
  peakMv: 30,
  lowerFraction: 0.1,
  upperFraction: 0.9,
} satisfies Input;
export const exampleOutput = {
  lowerCrossingMs: 1,
  upperCrossingMs: 2,
  riseTimeMs: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/action-potential-fractional-rise-time",
  title: "Action Potential Rise Time",
  description:
    "Interpolate fractional-amplitude rise time from a supplied positive spike rising limb and baseline/peak reference; the caller must isolate a single rising event.",
  inputs: inputFields,
  outputs: [
    { id: "lowerCrossingMs", label: "Lower crossing ms", kind: "number" },
    { id: "upperCrossingMs", label: "Upper crossing ms", kind: "number" },
    { id: "riseTimeMs", label: "Rise time ms", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      timesMs: value.timesMs as readonly number[],
      voltagesMv: value.voltagesMv as readonly number[],
      baselineMv: value.baselineMv as number,
      peakMv: value.peakMv as number,
      lowerFraction: value.lowerFraction as number,
      upperFraction: value.upperFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
