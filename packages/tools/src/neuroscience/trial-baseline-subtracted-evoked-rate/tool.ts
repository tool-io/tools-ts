import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly baselineCounts: readonly number[];
  readonly responseCounts: readonly number[];
  readonly baselineDurationSeconds: number;
  readonly responseDurationSeconds: number;
}>;
export type Output = Readonly<{
  readonly baselineMeanRateHz: number;
  readonly responseMeanRateHz: number;
  readonly netEvokedRateHz: number;
}>;
const inputFields = [
  { id: "baselineCounts", label: "Baseline counts", kind: "numberList" },
  { id: "responseCounts", label: "Response counts", kind: "numberList" },
  {
    id: "baselineDurationSeconds",
    label: "Baseline duration seconds",
    kind: "number",
  },
  {
    id: "responseDurationSeconds",
    label: "Response duration seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.baselineCounts, input.responseCounts, "baselineCounts");
  input.baselineCounts.forEach((v) => count(v, "baselineCounts"));
  input.responseCounts.forEach((v) => count(v, "responseCounts"));
  positive(input.baselineDurationSeconds, "baselineDurationSeconds");
  positive(input.responseDurationSeconds, "responseDurationSeconds");
  const baselineMeanRateHz =
      mean(input.baselineCounts) / input.baselineDurationSeconds,
    responseMeanRateHz =
      mean(input.responseCounts) / input.responseDurationSeconds;
  return {
    baselineMeanRateHz,
    responseMeanRateHz,
    netEvokedRateHz: responseMeanRateHz - baselineMeanRateHz,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  baselineCounts: [1, 2],
  responseCounts: [3, 4],
  baselineDurationSeconds: 1,
  responseDurationSeconds: 0.5,
} satisfies Input;
export const exampleOutput = {
  baselineMeanRateHz: 1.5,
  responseMeanRateHz: 7,
  netEvokedRateHz: 5.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/trial-baseline-subtracted-evoked-rate",
  title: "Evoked Firing Rate",
  description:
    "Compare paired trial spike counts over different baseline/response exposures and preserve signed net evoked rate, including suppression.",
  inputs: inputFields,
  outputs: [
    {
      id: "baselineMeanRateHz",
      label: "Baseline mean rate hz",
      kind: "number",
    },
    {
      id: "responseMeanRateHz",
      label: "Response mean rate hz",
      kind: "number",
    },
    { id: "netEvokedRateHz", label: "Net evoked rate hz", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      baselineCounts: value.baselineCounts as readonly number[],
      responseCounts: value.responseCounts as readonly number[],
      baselineDurationSeconds: value.baselineDurationSeconds as number,
      responseDurationSeconds: value.responseDurationSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
