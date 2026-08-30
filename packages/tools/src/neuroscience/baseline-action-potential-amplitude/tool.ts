import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, mean, window } from "../shared.js";
export type Input = Readonly<{
  readonly timesMs: readonly number[];
  readonly voltagesMv: readonly number[];
  readonly baselineStartMs: number;
  readonly baselineEndMs: number;
  readonly spikeStartMs: number;
  readonly spikeEndMs: number;
}>;
export type Output = Readonly<{
  readonly baselineMv: number;
  readonly peakMv: number;
  readonly amplitudeMv: number;
}>;
const inputFields = [
  { id: "timesMs", label: "Times ms", kind: "numberList" },
  { id: "voltagesMv", label: "Voltages mv", kind: "numberList" },
  { id: "baselineStartMs", label: "Baseline start ms", kind: "number" },
  { id: "baselineEndMs", label: "Baseline end ms", kind: "number" },
  { id: "spikeStartMs", label: "Spike start ms", kind: "number" },
  { id: "spikeEndMs", label: "Spike end ms", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.baselineEndMs >= input.spikeStartMs)
    simpleError(
      "spikeStartMs",
      "Disjoint baseline and spike windows required.",
    );
  const baselineMv = mean(
      window(
        input.timesMs,
        input.voltagesMv,
        input.baselineStartMs,
        input.baselineEndMs,
      ),
    ),
    peakMv = Math.max(
      ...window(
        input.timesMs,
        input.voltagesMv,
        input.spikeStartMs,
        input.spikeEndMs,
      ),
    );
  return { baselineMv, peakMv, amplitudeMv: peakMv - baselineMv };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesMs: [0, 1, 2, 3],
  voltagesMv: [-70, -70, 30, -60],
  baselineStartMs: 0,
  baselineEndMs: 1,
  spikeStartMs: 2,
  spikeEndMs: 3,
} satisfies Input;
export const exampleOutput = {
  baselineMv: -70,
  peakMv: 30,
  amplitudeMv: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/baseline-action-potential-amplitude",
  title: "Action Potential Amplitude",
  description:
    "Measure sampled positive-going action-potential peak relative to an explicit baseline window; sampling and filtering can bias peak amplitude.",
  inputs: inputFields,
  outputs: [
    { id: "baselineMv", label: "Baseline mv", kind: "number" },
    { id: "peakMv", label: "Peak mv", kind: "number" },
    { id: "amplitudeMv", label: "Amplitude mv", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      timesMs: value.timesMs as readonly number[],
      voltagesMv: value.voltagesMv as readonly number[],
      baselineStartMs: value.baselineStartMs as number,
      baselineEndMs: value.baselineEndMs as number,
      spikeStartMs: value.spikeStartMs as number,
      spikeEndMs: value.spikeEndMs as number,
    }),
});
export const run = tool.execute;
export default tool;
