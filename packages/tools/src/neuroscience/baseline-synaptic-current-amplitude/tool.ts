import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, mean, window } from "../shared.js";
export type Input = Readonly<{
  readonly timesMs: readonly number[];
  readonly currentsPa: readonly number[];
  readonly baselineStartMs: number;
  readonly baselineEndMs: number;
  readonly eventStartMs: number;
  readonly eventEndMs: number;
  readonly eventPolarity: number;
}>;
export type Output = Readonly<{
  readonly baselinePa: number;
  readonly peakCurrentPa: number;
  readonly signedAmplitudePa: number;
}>;
const inputFields = [
  { id: "timesMs", label: "Times ms", kind: "numberList" },
  { id: "currentsPa", label: "Currents pa", kind: "numberList" },
  { id: "baselineStartMs", label: "Baseline start ms", kind: "number" },
  { id: "baselineEndMs", label: "Baseline end ms", kind: "number" },
  { id: "eventStartMs", label: "Event start ms", kind: "number" },
  { id: "eventEndMs", label: "Event end ms", kind: "number" },
  { id: "eventPolarity", label: "Event polarity", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    (input.eventPolarity !== 1 && input.eventPolarity !== -1) ||
    input.baselineEndMs >= input.eventStartMs
  )
    simpleError(
      "eventPolarity",
      "Polarity ±1 and disjoint baseline/event windows required.",
    );
  const baselinePa = mean(
      window(
        input.timesMs,
        input.currentsPa,
        input.baselineStartMs,
        input.baselineEndMs,
      ),
    ),
    values = window(
      input.timesMs,
      input.currentsPa,
      input.eventStartMs,
      input.eventEndMs,
    ),
    peakCurrentPa =
      input.eventPolarity === 1 ? Math.max(...values) : Math.min(...values);
  return {
    baselinePa,
    peakCurrentPa,
    signedAmplitudePa: peakCurrentPa - baselinePa,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesMs: [0, 1, 2, 3],
  currentsPa: [10, 10, -30, 0],
  baselineStartMs: 0,
  baselineEndMs: 1,
  eventStartMs: 2,
  eventEndMs: 3,
  eventPolarity: -1,
} satisfies Input;
export const exampleOutput = {
  baselinePa: 10,
  peakCurrentPa: -30,
  signedAmplitudePa: -40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/baseline-synaptic-current-amplitude",
  title: "Synaptic Current Amplitude",
  description:
    "Measure a caller-polarity synaptic current extremum relative to a sampled baseline; inward currents preserve a negative amplitude.",
  inputs: inputFields,
  outputs: [
    { id: "baselinePa", label: "Baseline pa", kind: "number" },
    { id: "peakCurrentPa", label: "Peak current pa", kind: "number" },
    { id: "signedAmplitudePa", label: "Signed amplitude pa", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      timesMs: value.timesMs as readonly number[],
      currentsPa: value.currentsPa as readonly number[],
      baselineStartMs: value.baselineStartMs as number,
      baselineEndMs: value.baselineEndMs as number,
      eventStartMs: value.eventStartMs as number,
      eventEndMs: value.eventEndMs as number,
      eventPolarity: value.eventPolarity as number,
    }),
});
export const run = tool.execute;
export default tool;
