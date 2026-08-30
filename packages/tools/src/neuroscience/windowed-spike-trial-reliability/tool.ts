import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../shared.js";
export type Input = Readonly<{
  readonly trialSpikeLatenciesMs: readonly (readonly number[])[];
  readonly responseWindowStartMs: number;
  readonly responseWindowEndMs: number;
}>;
export type Output = Readonly<{
  readonly responsiveTrialIndexes: readonly number[];
  readonly responseReliability: number;
}>;
const inputFields = [
  {
    id: "trialSpikeLatenciesMs",
    label: "Trial spike latencies ms",
    kind: "matrix",
  },
  {
    id: "responseWindowStartMs",
    label: "Response window start ms",
    kind: "number",
  },
  {
    id: "responseWindowEndMs",
    label: "Response window end ms",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.trialSpikeLatenciesMs.length ||
    input.responseWindowEndMs < input.responseWindowStartMs
  )
    simpleError(
      "responseWindowEndMs",
      "Nonempty trial spike lists and ordered response bounds required.",
    );
  input.trialSpikeLatenciesMs.forEach((row) => {
    if (row.some((v, i) => i > 0 && v <= row[i - 1]))
      simpleError(
        "trialSpikeLatenciesMs",
        "Spike latencies within each trial must be strictly increasing.",
      );
  });
  const responsiveTrialIndexes = input.trialSpikeLatenciesMs.flatMap(
    (row, i) =>
      row.some(
        (v) =>
          v >= input.responseWindowStartMs && v <= input.responseWindowEndMs,
      )
        ? [i]
        : [],
  );
  return {
    responsiveTrialIndexes,
    responseReliability:
      responsiveTrialIndexes.length / input.trialSpikeLatenciesMs.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  trialSpikeLatenciesMs: [[2, 5], [20], [4]],
  responseWindowStartMs: 0,
  responseWindowEndMs: 10,
} satisfies Input;
export const exampleOutput = {
  responsiveTrialIndexes: [0, 2],
  responseReliability: 0.6666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/windowed-spike-trial-reliability",
  title: "Spike Reliability",
  description:
    "Measure trial reliability as at least one spike in a supplied inclusive response window; empty trials count as nonresponsive, not missing observations.",
  inputs: inputFields,
  outputs: [
    {
      id: "responsiveTrialIndexes",
      label: "Responsive trial indexes",
      kind: "numberList",
    },
    {
      id: "responseReliability",
      label: "Response reliability",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      trialSpikeLatenciesMs:
        value.trialSpikeLatenciesMs as readonly (readonly number[])[],
      responseWindowStartMs: value.responseWindowStartMs as number,
      responseWindowEndMs: value.responseWindowEndMs as number,
    }),
});
export const run = tool.execute;
export default tool;
