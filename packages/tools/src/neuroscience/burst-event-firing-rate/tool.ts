import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly burstIntervalsSeconds: readonly (readonly number[])[];
  readonly spikesPerBurst: readonly number[];
  readonly recordingDurationSeconds: number;
}>;
export type Output = Readonly<{
  readonly burstsPerSecond: number;
  readonly burstSpikesPerSecond: number;
  readonly meanWithinBurstRateHz: number;
}>;
const inputFields = [
  {
    id: "burstIntervalsSeconds",
    label: "Burst intervals seconds",
    kind: "matrix",
  },
  { id: "spikesPerBurst", label: "Spikes per burst", kind: "numberList" },
  {
    id: "recordingDurationSeconds",
    label: "Recording duration seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.burstIntervalsSeconds,
    input.spikesPerBurst,
    "burstIntervalsSeconds",
  );
  positive(input.recordingDurationSeconds, "recordingDurationSeconds");
  let previousEnd = 0;
  const within = input.burstIntervalsSeconds.map((row, i) => {
    count(input.spikesPerBurst[i], "spikesPerBurst", 2);
    if (
      row.length !== 2 ||
      row[0] < 0 ||
      row[1] <= row[0] ||
      row[1] > input.recordingDurationSeconds ||
      (i > 0 && row[0] < previousEnd)
    )
      simpleError(
        "burstIntervalsSeconds",
        "Ordered nonoverlapping positive-duration burst windows within the recording required.",
      );
    previousEnd = row[1];
    return (input.spikesPerBurst[i] - 1) / (row[1] - row[0]);
  });
  return {
    burstsPerSecond: within.length / input.recordingDurationSeconds,
    burstSpikesPerSecond:
      input.spikesPerBurst.reduce((a, b) => a + b, 0) /
      input.recordingDurationSeconds,
    meanWithinBurstRateHz: mean(within),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  burstIntervalsSeconds: [
    [1, 1.2],
    [3, 3.4],
  ],
  spikesPerBurst: [3, 4],
  recordingDurationSeconds: 10,
} satisfies Input;
export const exampleOutput = {
  burstsPerSecond: 0.2,
  burstSpikesPerSecond: 0.7,
  meanWithinBurstRateHz: 8.75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/burst-event-firing-rate",
  title: "Burst Firing Rate",
  description:
    "Summarize already-detected burst intervals as event rate, burst-assigned spike rate and mean within-burst ISI rate; differs from classifying raw spike burst fraction.",
  inputs: inputFields,
  outputs: [
    { id: "burstsPerSecond", label: "Bursts per second", kind: "number" },
    {
      id: "burstSpikesPerSecond",
      label: "Burst spikes per second",
      kind: "number",
    },
    {
      id: "meanWithinBurstRateHz",
      label: "Mean within burst rate hz",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      burstIntervalsSeconds:
        value.burstIntervalsSeconds as readonly (readonly number[])[],
      spikesPerBurst: value.spikesPerBurst as readonly number[],
      recordingDurationSeconds: value.recordingDurationSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
