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
  fraction,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly initialAdultBees: number;
  readonly developmentLagDays: number;
  readonly priorDailyEggCounts: readonly number[];
  readonly forecastDailyEggCounts: readonly number[];
  readonly emergenceSurvivalFraction: number;
  readonly adultDailySurvivalFraction: number;
}>;
export type Output = Readonly<{
  readonly emergingBeesByDay: readonly number[];
  readonly expectedAdultBeesByDay: readonly number[];
}>;
const inputFields = [
  { id: "initialAdultBees", label: "Initial adult bees", kind: "number" },
  { id: "developmentLagDays", label: "Development lag days", kind: "integer" },
  {
    id: "priorDailyEggCounts",
    label: "Prior daily egg counts",
    kind: "numberList",
  },
  {
    id: "forecastDailyEggCounts",
    label: "Forecast daily egg counts",
    kind: "numberList",
  },
  {
    id: "emergenceSurvivalFraction",
    label: "Emergence survival fraction",
    kind: "number",
  },
  {
    id: "adultDailySurvivalFraction",
    label: "Adult daily survival fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.developmentLagDays, "developmentLagDays");
  nonnegative(input.initialAdultBees, "initialAdultBees");
  input.priorDailyEggCounts.forEach((v) =>
    nonnegative(v, "priorDailyEggCounts"),
  );
  input.forecastDailyEggCounts.forEach((v) =>
    nonnegative(v, "forecastDailyEggCounts"),
  );
  fraction(input.emergenceSurvivalFraction, "emergenceSurvivalFraction");
  fraction(input.adultDailySurvivalFraction, "adultDailySurvivalFraction");
  count(input.developmentLagDays, "developmentLagDays");
  if (
    input.priorDailyEggCounts.length !== input.developmentLagDays ||
    !input.forecastDailyEggCounts.length
  )
    simpleError(
      "priorDailyEggCounts",
      "One prior cohort per lag day and nonempty forecast required.",
    );
  let adults = input.initialAdultBees;
  const emergingBeesByDay = input.forecastDailyEggCounts.map(
      (_, i) =>
        (i < input.developmentLagDays
          ? input.priorDailyEggCounts[i]
          : input.forecastDailyEggCounts[i - input.developmentLagDays]) *
        input.emergenceSurvivalFraction,
    ),
    expectedAdultBeesByDay = emergingBeesByDay.map((v) => {
      adults = adults * input.adultDailySurvivalFraction + v;
      return adults;
    });
  return { emergingBeesByDay, expectedAdultBeesByDay };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialAdultBees: 100,
  developmentLagDays: 2,
  priorDailyEggCounts: [10, 20],
  forecastDailyEggCounts: [30, 40, 50],
  emergenceSurvivalFraction: 0.5,
  adultDailySurvivalFraction: 0.9,
} satisfies Input;
export const exampleOutput = {
  emergingBeesByDay: [5, 10, 15],
  expectedAdultBeesByDay: [95, 95.5, 100.95],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/population-growth-from-laying-rate",
  title: "Population Growth From Laying Rate Estimator",
  description:
    "Project delayed brood cohorts into expected adult population with caller development lag and conditional survival; no embedded worker-development duration, swarming or migration model.",
  inputs: inputFields,
  outputs: [
    {
      id: "emergingBeesByDay",
      label: "Emerging bees by day",
      kind: "numberList",
    },
    {
      id: "expectedAdultBeesByDay",
      label: "Expected adult bees by day",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      initialAdultBees: value.initialAdultBees as number,
      developmentLagDays: value.developmentLagDays as number,
      priorDailyEggCounts: value.priorDailyEggCounts as readonly number[],
      forecastDailyEggCounts: value.forecastDailyEggCounts as readonly number[],
      emergenceSurvivalFraction: value.emergenceSurvivalFraction as number,
      adultDailySurvivalFraction: value.adultDailySurvivalFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
