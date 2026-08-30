import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count, ordered } from "../shared.js";
export type Input = Readonly<{
  readonly spikeTimesMs: readonly number[];
  readonly maximumWithinBurstIsiMs: number;
  readonly minimumBurstSpikes: number;
}>;
export type Output = Readonly<{
  readonly burstStartIndexes: readonly number[];
  readonly burstSpikeCount: number;
  readonly burstFraction: number;
}>;
const inputFields = [
  { id: "spikeTimesMs", label: "Spike times ms", kind: "numberList" },
  {
    id: "maximumWithinBurstIsiMs",
    label: "Maximum within burst isi ms",
    kind: "number",
  },
  { id: "minimumBurstSpikes", label: "Minimum burst spikes", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.spikeTimesMs, "spikeTimesMs");
  positive(input.maximumWithinBurstIsiMs, "maximumWithinBurstIsiMs");
  count(input.minimumBurstSpikes, "minimumBurstSpikes", 2);
  let start = 0,
    burstSpikeCount = 0;
  const burstStartIndexes: number[] = [];
  for (let i = 1; i <= input.spikeTimesMs.length; i++)
    if (
      i === input.spikeTimesMs.length ||
      input.spikeTimesMs[i] - input.spikeTimesMs[i - 1] >
        input.maximumWithinBurstIsiMs
    ) {
      if (i - start >= input.minimumBurstSpikes) {
        burstStartIndexes.push(start);
        burstSpikeCount += i - start;
      }
      start = i;
    }
  return {
    burstStartIndexes,
    burstSpikeCount,
    burstFraction: burstSpikeCount / input.spikeTimesMs.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  spikeTimesMs: [0, 2, 4, 100],
  maximumWithinBurstIsiMs: 5,
  minimumBurstSpikes: 3,
} satisfies Input;
export const exampleOutput = {
  burstStartIndexes: [0],
  burstSpikeCount: 3,
  burstFraction: 0.75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/burst-spike-fraction",
  title: "Burst Index",
  description:
    "Classify maximal spike runs using a supplied ISI gap and minimum burst length; report the fraction of spikes assigned to bursts, not a universal burst-index definition.",
  inputs: inputFields,
  outputs: [
    {
      id: "burstStartIndexes",
      label: "Burst start indexes",
      kind: "numberList",
    },
    { id: "burstSpikeCount", label: "Burst spike count", kind: "number" },
    { id: "burstFraction", label: "Burst fraction", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      spikeTimesMs: value.spikeTimesMs as readonly number[],
      maximumWithinBurstIsiMs: value.maximumWithinBurstIsiMs as number,
      minimumBurstSpikes: value.minimumBurstSpikes as number,
    }),
});
export const run = tool.execute;
export default tool;
