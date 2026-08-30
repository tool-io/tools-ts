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
  mean,
  variance,
  regression,
  normalQuantile,
} from "../shared.js";
export type Input = Readonly<{
  readonly speciesEffectConcentrations: readonly number[];
}>;
export type Output = Readonly<{
  readonly logConcentrationMean: number;
  readonly logConcentrationSampleSd: number;
  readonly normalQuantileFitRSquared: number;
  readonly speciesCount: number;
}>;
const inputFields = [
  {
    id: "speciesEffectConcentrations",
    label: "Species effect concentrations",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.speciesEffectConcentrations.length < 3)
    simpleError(
      "speciesEffectConcentrations",
      "At least three independently selected species concentrations required.",
    );
  input.speciesEffectConcentrations.forEach((v) =>
    positive(v, "speciesEffectConcentrations"),
  );
  const logs = input.speciesEffectConcentrations
      .map(Math.log)
      .sort((a, b) => a - b),
    logConcentrationMean = mean(logs),
    logConcentrationSampleSd = positive(
      Math.sqrt(variance(logs)),
      "speciesEffectConcentrations",
    ),
    scores = logs.map((_, i) => normalQuantile((i + 0.5) / logs.length));
  return {
    logConcentrationMean,
    logConcentrationSampleSd,
    normalQuantileFitRSquared: regression(scores, logs).rSquared,
    speciesCount: logs.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  speciesEffectConcentrations: [0.36787944117144233, 1, 2.718281828459045],
} satisfies Input;
export const exampleOutput = {
  logConcentrationMean: 0,
  logConcentrationSampleSd: 1,
  normalQuantileFitRSquared: 1,
  speciesCount: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/lognormal-species-sensitivity-fit",
  title: "SSD Curve Fitting",
  description:
    "Estimate natural-log sample moments and a normal Q–Q linearity diagnostic for a species-sensitivity dataset; unlike quantile inversion, this fits data and does not claim statistical goodness-of-fit significance.",
  inputs: inputFields,
  outputs: [
    {
      id: "logConcentrationMean",
      label: "Log concentration mean",
      kind: "number",
    },
    {
      id: "logConcentrationSampleSd",
      label: "Log concentration sample sd",
      kind: "number",
    },
    {
      id: "normalQuantileFitRSquared",
      label: "Normal quantile fit r squared",
      kind: "number",
    },
    { id: "speciesCount", label: "Species count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      speciesEffectConcentrations:
        value.speciesEffectConcentrations as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
