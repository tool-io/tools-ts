import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count, normalQuantile } from "../shared.js";
export type Input = Readonly<{
  readonly hits: number;
  readonly signalTrials: number;
  readonly falseAlarms: number;
  readonly noiseTrials: number;
}>;
export type Output = Readonly<{
  readonly correctedHitRate: number;
  readonly correctedFalseAlarmRate: number;
  readonly dPrime: number;
}>;
const inputFields = [
  { id: "hits", label: "Hits", kind: "integer" },
  { id: "signalTrials", label: "Signal trials", kind: "integer" },
  { id: "falseAlarms", label: "False alarms", kind: "integer" },
  { id: "noiseTrials", label: "Noise trials", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.signalTrials, "signalTrials", 1);
  count(input.noiseTrials, "noiseTrials", 1);
  count(input.hits, "hits");
  count(input.falseAlarms, "falseAlarms");
  if (input.hits > input.signalTrials || input.falseAlarms > input.noiseTrials)
    simpleError("hits", "Response counts cannot exceed trial totals.");
  const correctedHitRate = (input.hits + 0.5) / (input.signalTrials + 1),
    correctedFalseAlarmRate =
      (input.falseAlarms + 0.5) / (input.noiseTrials + 1);
  return {
    correctedHitRate,
    correctedFalseAlarmRate,
    dPrime:
      normalQuantile(correctedHitRate) -
      normalQuantile(correctedFalseAlarmRate),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  hits: 8,
  signalTrials: 10,
  falseAlarms: 2,
  noiseTrials: 10,
} satisfies Input;
export const exampleOutput = {
  correctedHitRate: 0.7727272727272727,
  correctedFalseAlarmRate: 0.22727272727272727,
  dPrime: 1.4957171882410376,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/signal-detection-from-counts",
  title: "Signal Detection d Prime",
  description:
    "Compute d′ from trial counts with an explicit Hautus loglinear half-count correction, preserving finite extreme-count estimates; assumes equal-variance signal detection.",
  inputs: inputFields,
  outputs: [
    { id: "correctedHitRate", label: "Corrected hit rate", kind: "number" },
    {
      id: "correctedFalseAlarmRate",
      label: "Corrected false alarm rate",
      kind: "number",
    },
    { id: "dPrime", label: "D prime", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      hits: value.hits as number,
      signalTrials: value.signalTrials as number,
      falseAlarms: value.falseAlarms as number,
      noiseTrials: value.noiseTrials as number,
    }),
});
export const run = tool.execute;
export default tool;
