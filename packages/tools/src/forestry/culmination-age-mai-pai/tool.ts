import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  ordered,
  maximum,
} from "../shared.js";
export type Input = Readonly<{
  readonly surveyAgesYears: readonly number[];
  readonly cumulativeProductionM3PerHa: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedMaiM3PerHaYear: readonly number[];
  readonly intervalPaiM3PerHaYear: readonly number[];
  readonly sampledMaiCulminationAgeYears: number;
}>;
const inputFields = [
  { id: "surveyAgesYears", label: "Survey ages years", kind: "numberList" },
  {
    id: "cumulativeProductionM3PerHa",
    label: "Cumulative production m3 per ha",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.surveyAgesYears.forEach((v) => positive(v, "surveyAgesYears"));
  input.cumulativeProductionM3PerHa.forEach((v) =>
    nonnegative(v, "cumulativeProductionM3PerHa"),
  );
  ordered(input.surveyAgesYears, "surveyAgesYears");
  aligned(input.surveyAgesYears, input.cumulativeProductionM3PerHa, "surveys");
  const observedMaiM3PerHaYear = input.cumulativeProductionM3PerHa.map(
      (v, i) => v / input.surveyAgesYears[i],
    ),
    intervalPaiM3PerHaYear = input.cumulativeProductionM3PerHa
      .slice(1)
      .map(
        (v, i) =>
          nonnegative(
            v - input.cumulativeProductionM3PerHa[i],
            "cumulativeProduction",
          ) /
          (input.surveyAgesYears[i + 1] - input.surveyAgesYears[i]),
      );
  return {
    observedMaiM3PerHaYear,
    intervalPaiM3PerHaYear,
    sampledMaiCulminationAgeYears:
      input.surveyAgesYears[
        observedMaiM3PerHaYear.indexOf(maximum(observedMaiM3PerHaYear))
      ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  surveyAgesYears: [10, 20, 30],
  cumulativeProductionM3PerHa: [50, 160, 210],
} satisfies Input;
export const exampleOutput = {
  observedMaiM3PerHaYear: [5, 8, 7],
  intervalPaiM3PerHaYear: [11, 5],
  sampledMaiCulminationAgeYears: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/culmination-age-mai-pai",
  title: "Culmination Age MAI PAI",
  description:
    "Audit sampled cumulative production through MAI and interval PAI, returning first age of sampled MAI maximum; distinct from existing one-interval increment formulas and no continuous unsampled peak inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedMaiM3PerHaYear",
      label: "Observed mai m3 per ha year",
      kind: "numberList",
    },
    {
      id: "intervalPaiM3PerHaYear",
      label: "Interval pai m3 per ha year",
      kind: "numberList",
    },
    {
      id: "sampledMaiCulminationAgeYears",
      label: "Sampled mai culmination age years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      surveyAgesYears: value.surveyAgesYears as readonly number[],
      cumulativeProductionM3PerHa:
        value.cumulativeProductionM3PerHa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
