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
  fraction,
  aligned,
  binary,
} from "../shared.js";
export type Input = Readonly<{
  readonly priorSyntheticProbability: number;
  readonly observedIndicatorFlags: readonly number[];
  readonly syntheticIndicatorProbabilities: readonly number[];
  readonly naturalIndicatorProbabilities: readonly number[];
}>;
export type Output = Readonly<{
  readonly independentModelSyntheticProbability: number;
  readonly logEvidenceLikelihoodRatio: number;
}>;
const inputFields = [
  {
    id: "priorSyntheticProbability",
    label: "Prior synthetic probability",
    kind: "number",
  },
  {
    id: "observedIndicatorFlags",
    label: "Observed indicator flags",
    kind: "numberList",
  },
  {
    id: "syntheticIndicatorProbabilities",
    label: "Synthetic indicator probabilities",
    kind: "numberList",
  },
  {
    id: "naturalIndicatorProbabilities",
    label: "Natural indicator probabilities",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.priorSyntheticProbability, "priorSyntheticProbability");
  input.syntheticIndicatorProbabilities.forEach((v) =>
    positive(v, "syntheticIndicatorProbabilities"),
  );
  input.naturalIndicatorProbabilities.forEach((v) =>
    positive(v, "naturalIndicatorProbabilities"),
  );
  fraction(input.priorSyntheticProbability, "priorSyntheticProbability");
  input.syntheticIndicatorProbabilities.forEach((v) =>
    fraction(v, "syntheticIndicatorProbabilities"),
  );
  input.naturalIndicatorProbabilities.forEach((v) =>
    fraction(v, "naturalIndicatorProbabilities"),
  );
  aligned(
    input.observedIndicatorFlags,
    input.syntheticIndicatorProbabilities,
    "observedIndicatorFlags",
  );
  aligned(
    input.observedIndicatorFlags,
    input.naturalIndicatorProbabilities,
    "observedIndicatorFlags",
  );
  binary(input.observedIndicatorFlags, "indicators");
  if (
    input.priorSyntheticProbability === 1 ||
    input.syntheticIndicatorProbabilities.some((v) => v === 1) ||
    input.naturalIndicatorProbabilities.some((v) => v === 1)
  )
    simpleError(
      "probabilities",
      "Strict (0,1) calibrated probabilities required.",
    );
  const logEvidenceLikelihoodRatio = input.observedIndicatorFlags.reduce(
      (s, v, i) =>
        s +
        (v
          ? Math.log(input.syntheticIndicatorProbabilities[i]) -
            Math.log(input.naturalIndicatorProbabilities[i])
          : Math.log1p(-input.syntheticIndicatorProbabilities[i]) -
            Math.log1p(-input.naturalIndicatorProbabilities[i])),
      0,
    ),
    odds =
      Math.log(input.priorSyntheticProbability) -
      Math.log1p(-input.priorSyntheticProbability) +
      logEvidenceLikelihoodRatio,
    p =
      odds >= 0
        ? 1 / (1 + Math.exp(-odds))
        : Math.exp(odds) / (1 + Math.exp(odds));
  return {
    independentModelSyntheticProbability: p,
    logEvidenceLikelihoodRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  priorSyntheticProbability: 0.5,
  observedIndicatorFlags: [1, 0],
  syntheticIndicatorProbabilities: [0.8, 0.5],
  naturalIndicatorProbabilities: [0.2, 0.5],
} satisfies Input;
export const exampleOutput = {
  independentModelSyntheticProbability: 0.8,
  logEvidenceLikelihoodRatio: 1.3862943611198906,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/synthetic-indicator-scorer",
  title: "Synthetic vs Natural Indicator Matrix Scorer",
  description:
    "Combine caller independently calibrated indicator likelihoods/prior under explicit conditional-independence model, retaining absent evidence; correlated observations invalidate naïve combination and result is not natural/synthetic certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "independentModelSyntheticProbability",
      label: "Independent model synthetic probability",
      kind: "number",
    },
    {
      id: "logEvidenceLikelihoodRatio",
      label: "Log evidence likelihood ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      priorSyntheticProbability: value.priorSyntheticProbability as number,
      observedIndicatorFlags: value.observedIndicatorFlags as readonly number[],
      syntheticIndicatorProbabilities:
        value.syntheticIndicatorProbabilities as readonly number[],
      naturalIndicatorProbabilities:
        value.naturalIndicatorProbabilities as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
