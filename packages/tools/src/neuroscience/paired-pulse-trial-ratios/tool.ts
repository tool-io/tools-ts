import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly firstResponses: readonly number[];
  readonly secondResponses: readonly number[];
}>;
export type Output = Readonly<{
  readonly trialRatios: readonly number[];
  readonly meanTrialRatio: number;
  readonly ratioOfMeanResponses: number;
}>;
const inputFields = [
  { id: "firstResponses", label: "First responses", kind: "numberList" },
  { id: "secondResponses", label: "Second responses", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.firstResponses, input.secondResponses, "firstResponses");
  input.firstResponses.forEach((v) => positive(v, "firstResponses"));
  input.secondResponses.forEach((v) => nonnegative(v, "secondResponses"));
  const trialRatios = input.firstResponses.map(
    (v, i) => input.secondResponses[i] / v,
  );
  return {
    trialRatios,
    meanTrialRatio: mean(trialRatios),
    ratioOfMeanResponses:
      mean(input.secondResponses) / mean(input.firstResponses),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstResponses: [2, 4],
  secondResponses: [4, 4],
} satisfies Input;
export const exampleOutput = {
  trialRatios: [2, 1],
  meanTrialRatio: 1.5,
  ratioOfMeanResponses: 1.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/paired-pulse-trial-ratios",
  title: "Paired Pulse Ratio",
  description:
    "Distinguish mean paired-trial second/first ratios from ratio of mean response magnitudes; use consistently baseline-corrected nonnegative amplitudes.",
  inputs: inputFields,
  outputs: [
    { id: "trialRatios", label: "Trial ratios", kind: "numberList" },
    { id: "meanTrialRatio", label: "Mean trial ratio", kind: "number" },
    {
      id: "ratioOfMeanResponses",
      label: "Ratio of mean responses",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstResponses: value.firstResponses as readonly number[],
      secondResponses: value.secondResponses as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
