import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, ordered } from "../shared.js";
export type Input = Readonly<{
  readonly spikeTimesSeconds: readonly number[];
  readonly binEdgesSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly binCounts: readonly number[];
  readonly ratesHz: readonly number[];
  readonly peakRateHz: number;
}>;
const inputFields = [
  { id: "spikeTimesSeconds", label: "Spike times seconds", kind: "numberList" },
  { id: "binEdgesSeconds", label: "Bin edges seconds", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.binEdgesSeconds, "binEdgesSeconds");
  if (
    input.spikeTimesSeconds.some(
      (v, i) => i > 0 && v <= input.spikeTimesSeconds[i - 1],
    )
  )
    simpleError(
      "spikeTimesSeconds",
      "Distinct increasing spike timestamps required.",
    );
  if (
    input.spikeTimesSeconds.some(
      (v) => v < input.binEdgesSeconds[0] || v >= input.binEdgesSeconds.at(-1)!,
    )
  )
    simpleError(
      "spikeTimesSeconds",
      "All spikes must be within the half-open recording bins.",
    );
  const binCounts = input.binEdgesSeconds.slice(1).map(() => 0);
  let k = 0;
  for (const spike of input.spikeTimesSeconds) {
    while (spike >= input.binEdgesSeconds[k + 1]) k++;
    binCounts[k]++;
  }
  const ratesHz = binCounts.map(
    (v, i) => v / (input.binEdgesSeconds[i + 1] - input.binEdgesSeconds[i]),
  );
  return { binCounts, ratesHz, peakRateHz: Math.max(...ratesHz) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  spikeTimesSeconds: [0.1, 0.2, 0.6],
  binEdgesSeconds: [0, 0.5, 1],
} satisfies Input;
export const exampleOutput = {
  binCounts: [2, 1],
  ratesHz: [4, 2],
  peakRateHz: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/binned-peak-firing-rate",
  title: "Peak Firing Rate",
  description:
    "Bin timestamped spikes into caller-defined half-open, possibly unequal-duration bins and report the peak observed firing rate.",
  inputs: inputFields,
  outputs: [
    { id: "binCounts", label: "Bin counts", kind: "numberList" },
    { id: "ratesHz", label: "Rates hz", kind: "numberList" },
    { id: "peakRateHz", label: "Peak rate hz", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      spikeTimesSeconds: value.spikeTimesSeconds as readonly number[],
      binEdgesSeconds: value.binEdgesSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
