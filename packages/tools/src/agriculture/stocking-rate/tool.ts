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
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly herdAnimalCounts: readonly number[];
  readonly grazingDurationsDays: readonly number[];
  readonly relativeAnimalUnitFactors: readonly number[];
  readonly grazedAreaHa: number;
  readonly accountingPeriodDays: number;
}>;
export type Output = Readonly<{
  readonly totalAnimalDays: number;
  readonly totalAnimalUnitDays: number;
  readonly animalUnitDaysPerHa: number;
  readonly meanAnimalUnitsPerHaOverPeriod: number;
}>;
const inputFields = [
  { id: "herdAnimalCounts", label: "Herd animal counts", kind: "numberList" },
  {
    id: "grazingDurationsDays",
    label: "Grazing durations days",
    kind: "numberList",
  },
  {
    id: "relativeAnimalUnitFactors",
    label: "Relative animal unit factors",
    kind: "numberList",
  },
  { id: "grazedAreaHa", label: "Grazed area ha", kind: "number" },
  {
    id: "accountingPeriodDays",
    label: "Accounting period days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.grazingDurationsDays.forEach((v) =>
    positive(v, "grazingDurationsDays"),
  );
  positive(input.grazedAreaHa, "grazedAreaHa");
  positive(input.accountingPeriodDays, "accountingPeriodDays");
  input.relativeAnimalUnitFactors.forEach((v) =>
    nonnegative(v, "relativeAnimalUnitFactors"),
  );
  input.herdAnimalCounts.forEach((v) => count(v, "herdAnimalCounts"));
  aligned(
    input.herdAnimalCounts,
    input.grazingDurationsDays,
    "herdAnimalCounts",
  );
  aligned(
    input.herdAnimalCounts,
    input.relativeAnimalUnitFactors,
    "herdAnimalCounts",
  );
  if (input.grazingDurationsDays.some((v) => v > input.accountingPeriodDays))
    simpleError(
      "grazingDurationsDays",
      "Each group exposure cannot exceed accounting period.",
    );
  const totalAnimalDays = input.herdAnimalCounts.reduce(
      (s, v, i) => s + v * input.grazingDurationsDays[i],
      0,
    ),
    totalAnimalUnitDays = input.herdAnimalCounts.reduce(
      (s, v, i) =>
        s +
        v * input.grazingDurationsDays[i] * input.relativeAnimalUnitFactors[i],
      0,
    );
  return {
    totalAnimalDays,
    totalAnimalUnitDays,
    animalUnitDaysPerHa: totalAnimalUnitDays / input.grazedAreaHa,
    meanAnimalUnitsPerHaOverPeriod:
      totalAnimalUnitDays / input.grazedAreaHa / input.accountingPeriodDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  herdAnimalCounts: [10, 20],
  grazingDurationsDays: [5, 10],
  relativeAnimalUnitFactors: [1, 0.5],
  grazedAreaHa: 10,
  accountingPeriodDays: 10,
} satisfies Input;
export const exampleOutput = {
  totalAnimalDays: 250,
  totalAnimalUnitDays: 150,
  animalUnitDaysPerHa: 15,
  meanAnimalUnitsPerHaOverPeriod: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/stocking-rate",
  title: "Agriculture Stocking Rate",
  description:
    "Account observed grazing exposure and caller animal-unit equivalents by actual area/time, not inferred forage carrying capacity or a fixed head/ha welfare limit.",
  inputs: inputFields,
  outputs: [
    { id: "totalAnimalDays", label: "Total animal days", kind: "number" },
    {
      id: "totalAnimalUnitDays",
      label: "Total animal unit days",
      kind: "number",
    },
    {
      id: "animalUnitDaysPerHa",
      label: "Animal unit days per ha",
      kind: "number",
    },
    {
      id: "meanAnimalUnitsPerHaOverPeriod",
      label: "Mean animal units per ha over period",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      herdAnimalCounts: value.herdAnimalCounts as readonly number[],
      grazingDurationsDays: value.grazingDurationsDays as readonly number[],
      relativeAnimalUnitFactors:
        value.relativeAnimalUnitFactors as readonly number[],
      grazedAreaHa: value.grazedAreaHa as number,
      accountingPeriodDays: value.accountingPeriodDays as number,
    }),
});
export const run = tool.execute;
export default tool;
