import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count, ordered, mean } from "../shared.js";
export type Input = Readonly<{
  readonly spikeTimesMs: readonly number[];
  readonly intervalsPerEnd: number;
}>;
export type Output = Readonly<{
  readonly earlyMeanIsiMs: number;
  readonly lateMeanIsiMs: number;
  readonly lateEarlyRateRatio: number;
}>;
const inputFields = [
  { id: "spikeTimesMs", label: "Spike times ms", kind: "numberList" },
  { id: "intervalsPerEnd", label: "Intervals per end", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.spikeTimesMs, "spikeTimesMs");
  count(input.intervalsPerEnd, "intervalsPerEnd", 1);
  const isi = input.spikeTimesMs
    .slice(1)
    .map((v, i) => v - input.spikeTimesMs[i]);
  if (2 * input.intervalsPerEnd > isi.length)
    simpleError(
      "intervalsPerEnd",
      "Disjoint early and late ISI groups required.",
    );
  const earlyMeanIsiMs = mean(isi.slice(0, input.intervalsPerEnd)),
    lateMeanIsiMs = mean(isi.slice(-input.intervalsPerEnd));
  return {
    earlyMeanIsiMs,
    lateMeanIsiMs,
    lateEarlyRateRatio: earlyMeanIsiMs / lateMeanIsiMs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  spikeTimesMs: [0, 10, 30, 70],
  intervalsPerEnd: 1,
} satisfies Input;
export const exampleOutput = {
  earlyMeanIsiMs: 10,
  lateMeanIsiMs: 40,
  lateEarlyRateRatio: 0.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/firing-rate-adaptation-ratio",
  title: "Adaptation Ratio",
  description:
    "Compare late versus early rates derived from disjoint groups of consecutive spike intervals; ratio below one indicates slowing, not a fitted adaptation mechanism.",
  inputs: inputFields,
  outputs: [
    { id: "earlyMeanIsiMs", label: "Early mean isi ms", kind: "number" },
    { id: "lateMeanIsiMs", label: "Late mean isi ms", kind: "number" },
    {
      id: "lateEarlyRateRatio",
      label: "Late early rate ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      spikeTimesMs: value.spikeTimesMs as readonly number[],
      intervalsPerEnd: value.intervalsPerEnd as number,
    }),
});
export const run = tool.execute;
export default tool;
