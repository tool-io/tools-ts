import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly componentMeanAgesYears: readonly number[];
  readonly componentAgeVariancesYearsSquared: readonly number[];
  readonly mixtureWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly mixtureMeanAgeYears: number;
  readonly withinComponentVarianceYearsSquared: number;
  readonly betweenComponentVarianceYearsSquared: number;
  readonly mixtureAgeStandardDeviationYears: number;
}>;
const inputFields = [
  {
    id: "componentMeanAgesYears",
    label: "Component mean ages years",
    kind: "numberList",
  },
  {
    id: "componentAgeVariancesYearsSquared",
    label: "Component age variances years squared",
    kind: "numberList",
  },
  { id: "mixtureWeights", label: "Mixture weights", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.componentAgeVariancesYearsSquared.forEach((v) =>
    nonnegative(v, "componentAgeVariancesYearsSquared"),
  );
  input.mixtureWeights.forEach((v) => nonnegative(v, "mixtureWeights"));
  aligned(
    input.componentMeanAgesYears,
    input.componentAgeVariancesYearsSquared,
    "componentMeanAgesYears",
  );
  aligned(
    input.componentMeanAgesYears,
    input.mixtureWeights,
    "componentMeanAgesYears",
  );
  const total = positive(
      input.mixtureWeights.reduce((a, b) => a + b, 0),
      "mixtureWeights",
    ),
    m = input.componentMeanAgesYears.reduce(
      (s, v, i) => s + (v * input.mixtureWeights[i]) / total,
      0,
    ),
    within = input.componentAgeVariancesYearsSquared.reduce(
      (s, v, i) => s + (v * input.mixtureWeights[i]) / total,
      0,
    ),
    between = input.componentMeanAgesYears.reduce(
      (s, v, i) => s + ((v - m) ** 2 * input.mixtureWeights[i]) / total,
      0,
    );
  return {
    mixtureMeanAgeYears: m,
    withinComponentVarianceYearsSquared: within,
    betweenComponentVarianceYearsSquared: between,
    mixtureAgeStandardDeviationYears: Math.sqrt(within + between),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  componentMeanAgesYears: [100, 200],
  componentAgeVariancesYearsSquared: [25, 100],
  mixtureWeights: [1, 3],
} satisfies Input;
export const exampleOutput = {
  mixtureMeanAgeYears: 175,
  withinComponentVarianceYearsSquared: 81.25,
  betweenComponentVarianceYearsSquared: 1875,
  mixtureAgeStandardDeviationYears: 44.22951503238533,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/time-averaging-mixing-model",
  title: "Taphonomic Time Averaging Mixing Model Estimate",
  description:
    "Combine supplied age-distribution components by the law of total variance, distinguishing within/between temporal mixing; no inferred depositional duration or deconvolved event dates.",
  inputs: inputFields,
  outputs: [
    {
      id: "mixtureMeanAgeYears",
      label: "Mixture mean age years",
      kind: "number",
    },
    {
      id: "withinComponentVarianceYearsSquared",
      label: "Within component variance years squared",
      kind: "number",
    },
    {
      id: "betweenComponentVarianceYearsSquared",
      label: "Between component variance years squared",
      kind: "number",
    },
    {
      id: "mixtureAgeStandardDeviationYears",
      label: "Mixture age standard deviation years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      componentMeanAgesYears: value.componentMeanAgesYears as readonly number[],
      componentAgeVariancesYearsSquared:
        value.componentAgeVariancesYearsSquared as readonly number[],
      mixtureWeights: value.mixtureWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
