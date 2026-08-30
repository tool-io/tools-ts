import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly pastureAreasHa: readonly number[];
  readonly measuredDryForageKgPerHa: readonly number[];
  readonly usableForageFractions: readonly number[];
  readonly callerDryForageKgPerAnimalDay: number;
  readonly planningDays: number;
}>;
export type Output = Readonly<{
  readonly modelUsableDryForageKg: number;
  readonly supportedAnimalDaysUnderBudget: number;
  readonly wholeAnimalsForFullPlanningPeriod: number;
}>;
const inputFields = [
  { id: "pastureAreasHa", label: "Pasture areas ha", kind: "numberList" },
  {
    id: "measuredDryForageKgPerHa",
    label: "Measured dry forage kg per ha",
    kind: "numberList",
  },
  {
    id: "usableForageFractions",
    label: "Usable forage fractions",
    kind: "numberList",
  },
  {
    id: "callerDryForageKgPerAnimalDay",
    label: "Caller dry forage kg per animal day",
    kind: "number",
  },
  { id: "planningDays", label: "Planning days", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerDryForageKgPerAnimalDay,
    "callerDryForageKgPerAnimalDay",
  );
  positive(input.planningDays, "planningDays");
  input.pastureAreasHa.forEach((v) => nonnegative(v, "pastureAreasHa"));
  input.measuredDryForageKgPerHa.forEach((v) =>
    nonnegative(v, "measuredDryForageKgPerHa"),
  );
  input.usableForageFractions.forEach((v) =>
    fraction(v, "usableForageFractions"),
  );
  aligned(
    input.pastureAreasHa,
    input.measuredDryForageKgPerHa,
    "pastureAreasHa",
  );
  aligned(input.pastureAreasHa, input.usableForageFractions, "pastureAreasHa");
  const modelUsableDryForageKg = input.pastureAreasHa.reduce(
      (s, v, i) =>
        s +
        v * input.measuredDryForageKgPerHa[i] * input.usableForageFractions[i],
      0,
    ),
    supportedAnimalDaysUnderBudget =
      modelUsableDryForageKg / input.callerDryForageKgPerAnimalDay,
    wholeAnimalsForFullPlanningPeriod = Math.floor(
      supportedAnimalDaysUnderBudget / input.planningDays,
    );
  count(wholeAnimalsForFullPlanningPeriod, "wholeAnimals");
  return {
    modelUsableDryForageKg,
    supportedAnimalDaysUnderBudget,
    wholeAnimalsForFullPlanningPeriod,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pastureAreasHa: [1, 2],
  measuredDryForageKgPerHa: [1000, 500],
  usableForageFractions: [0.5, 0.5],
  callerDryForageKgPerAnimalDay: 10,
  planningDays: 30,
} satisfies Input;
export const exampleOutput = {
  modelUsableDryForageKg: 1000,
  supportedAnimalDaysUnderBudget: 100,
  wholeAnimalsForFullPlanningPeriod: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/pasture-carrying-capacity",
  title: "Agriculture Pasture Carrying Capacity",
  description:
    "Screen full-period animal counts from measured heterogeneous pasture forage with caller usable fraction/daily intake; excludes regrowth, nutrients and animal welfare and differs from generic population or aquaculture capacity models.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelUsableDryForageKg",
      label: "Model usable dry forage kg",
      kind: "number",
    },
    {
      id: "supportedAnimalDaysUnderBudget",
      label: "Supported animal days under budget",
      kind: "number",
    },
    {
      id: "wholeAnimalsForFullPlanningPeriod",
      label: "Whole animals for full planning period",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      pastureAreasHa: value.pastureAreasHa as readonly number[],
      measuredDryForageKgPerHa:
        value.measuredDryForageKgPerHa as readonly number[],
      usableForageFractions: value.usableForageFractions as readonly number[],
      callerDryForageKgPerAnimalDay:
        value.callerDryForageKgPerAnimalDay as number,
      planningDays: value.planningDays as number,
    }),
});
export const run = tool.execute;
export default tool;
