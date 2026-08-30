import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly stratumPopulationSizes: readonly number[];
  readonly excessRiskEstimates: readonly number[];
}>;
export type Output = Readonly<{
  readonly stratumExpectedExcessCases: readonly number[];
  readonly totalExpectedExcessCases: number;
  readonly populationWeightedExcessRisk: number;
}>;
const inputFields = [
  {
    id: "stratumPopulationSizes",
    label: "Stratum population sizes",
    kind: "numberList",
  },
  {
    id: "excessRiskEstimates",
    label: "Excess risk estimates",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.stratumPopulationSizes,
    input.excessRiskEstimates,
    "stratumPopulationSizes",
  );
  input.stratumPopulationSizes.forEach((v) =>
    count(v, "stratumPopulationSizes"),
  );
  input.excessRiskEstimates.forEach((v) => fraction(v, "excessRiskEstimates"));
  const population = positive(
      input.stratumPopulationSizes.reduce((a, b) => a + b, 0),
      "stratumPopulationSizes",
    ),
    stratumExpectedExcessCases = input.stratumPopulationSizes.map(
      (v, i) => v * input.excessRiskEstimates[i],
    ),
    totalExpectedExcessCases = stratumExpectedExcessCases.reduce(
      (a, b) => a + b,
      0,
    );
  return {
    stratumExpectedExcessCases,
    totalExpectedExcessCases,
    populationWeightedExcessRisk: totalExpectedExcessCases / population,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stratumPopulationSizes: [1000, 2000],
  excessRiskEstimates: [0.001, 0.002],
} satisfies Input;
export const exampleOutput = {
  stratumExpectedExcessCases: [1, 4],
  totalExpectedExcessCases: 5,
  populationWeightedExcessRisk: 0.0016666666666666668,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/population-risk-expected-cases",
  title: "Population Risk",
  description:
    "Aggregate supplied excess-risk estimates across nonoverlapping population strata into expected cases, not observed case counts or causal attribution.",
  inputs: inputFields,
  outputs: [
    {
      id: "stratumExpectedExcessCases",
      label: "Stratum expected excess cases",
      kind: "numberList",
    },
    {
      id: "totalExpectedExcessCases",
      label: "Total expected excess cases",
      kind: "number",
    },
    {
      id: "populationWeightedExcessRisk",
      label: "Population weighted excess risk",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      stratumPopulationSizes: value.stratumPopulationSizes as readonly number[],
      excessRiskEstimates: value.excessRiskEstimates as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
