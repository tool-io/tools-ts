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
  nonnegative,
  count,
  mean,
  quantile,
} from "../shared.js";
export type Input = Readonly<{
  readonly goReactionTimesMs: readonly number[];
  readonly goOmissions: number;
  readonly failedStopTrials: number;
  readonly totalStopTrials: number;
  readonly stopSignalDelaysMs: readonly number[];
}>;
export type Output = Readonly<{
  readonly responseProbability: number;
  readonly integrationQuantileMs: number;
  readonly meanStopSignalDelayMs: number;
  readonly estimatedSsrtMs: number;
  readonly negativeEstimate: boolean;
}>;
const inputFields = [
  {
    id: "goReactionTimesMs",
    label: "Go reaction times ms",
    kind: "numberList",
  },
  { id: "goOmissions", label: "Go omissions", kind: "integer" },
  { id: "failedStopTrials", label: "Failed stop trials", kind: "integer" },
  { id: "totalStopTrials", label: "Total stop trials", kind: "integer" },
  {
    id: "stopSignalDelaysMs",
    label: "Stop signal delays ms",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.goReactionTimesMs.length < 2)
    simpleError(
      "goReactionTimesMs",
      "At least two successful go responses required.",
    );
  input.goReactionTimesMs.forEach((v) => positive(v, "goReactionTimesMs"));
  count(input.goOmissions, "goOmissions");
  count(input.totalStopTrials, "totalStopTrials", 1);
  count(input.failedStopTrials, "failedStopTrials");
  if (
    input.failedStopTrials === 0 ||
    input.failedStopTrials >= input.totalStopTrials ||
    input.stopSignalDelaysMs.length !== input.totalStopTrials
  )
    simpleError(
      "failedStopTrials",
      "Interior stop-response probability and a delay for each stop trial required.",
    );
  if (input.goOmissions + input.goReactionTimesMs.length > 100000)
    simpleError("goOmissions", "Omission replacement exceeds sample budget.");
  input.stopSignalDelaysMs.forEach((v) => nonnegative(v, "stopSignalDelaysMs"));
  const maximum = Math.max(...input.goReactionTimesMs),
    go = [
      ...input.goReactionTimesMs,
      ...Array<number>(input.goOmissions).fill(maximum),
    ],
    responseProbability = input.failedStopTrials / input.totalStopTrials,
    integrationQuantileMs = quantile(go, responseProbability),
    meanStopSignalDelayMs = mean(input.stopSignalDelaysMs),
    estimatedSsrtMs = integrationQuantileMs - meanStopSignalDelayMs;
  return {
    responseProbability,
    integrationQuantileMs,
    meanStopSignalDelayMs,
    estimatedSsrtMs,
    negativeEstimate: estimatedSsrtMs < 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  goReactionTimesMs: [100, 200, 300, 400],
  goOmissions: 0,
  failedStopTrials: 2,
  totalStopTrials: 4,
  stopSignalDelaysMs: [50, 50, 50, 50],
} satisfies Input;
export const exampleOutput = {
  responseProbability: 0.5,
  integrationQuantileMs: 250,
  meanStopSignalDelayMs: 50,
  estimatedSsrtMs: 200,
  negativeEstimate: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/stop-signal-integration-estimate",
  title: "Stop Signal Reaction Time",
  description:
    "Estimate integration-method SSRT using linearly interpolated go-RT quantiles and max-RT omission replacement; negative estimates are preserved and flagged, not validated as race-model compatible.",
  inputs: inputFields,
  outputs: [
    {
      id: "responseProbability",
      label: "Response probability",
      kind: "number",
    },
    {
      id: "integrationQuantileMs",
      label: "Integration quantile ms",
      kind: "number",
    },
    {
      id: "meanStopSignalDelayMs",
      label: "Mean stop signal delay ms",
      kind: "number",
    },
    { id: "estimatedSsrtMs", label: "Estimated ssrt ms", kind: "number" },
    { id: "negativeEstimate", label: "Negative estimate", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      goReactionTimesMs: value.goReactionTimesMs as readonly number[],
      goOmissions: value.goOmissions as number,
      failedStopTrials: value.failedStopTrials as number,
      totalStopTrials: value.totalStopTrials as number,
      stopSignalDelaysMs: value.stopSignalDelaysMs as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
