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
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly fieldAreasHa: readonly number[];
  readonly calibratedSeedRatesKgPerHa: readonly number[];
  readonly handlingLossFractions: readonly number[];
  readonly seedBagMassKg: number;
}>;
export type Output = Readonly<{
  readonly fieldGrossSeedRequirementsKg: readonly number[];
  readonly totalGrossSeedRequirementKg: number;
  readonly wholeBagCount: number;
  readonly seedMassRemainderKg: number;
}>;
const inputFields = [
  { id: "fieldAreasHa", label: "Field areas ha", kind: "numberList" },
  {
    id: "calibratedSeedRatesKgPerHa",
    label: "Calibrated seed rates kg per ha",
    kind: "numberList",
  },
  {
    id: "handlingLossFractions",
    label: "Handling loss fractions",
    kind: "numberList",
  },
  { id: "seedBagMassKg", label: "Seed bag mass kg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.seedBagMassKg, "seedBagMassKg");
  input.fieldAreasHa.forEach((v) => nonnegative(v, "fieldAreasHa"));
  input.calibratedSeedRatesKgPerHa.forEach((v) =>
    nonnegative(v, "calibratedSeedRatesKgPerHa"),
  );
  input.handlingLossFractions.forEach((v) =>
    fraction(v, "handlingLossFractions"),
  );
  aligned(input.fieldAreasHa, input.calibratedSeedRatesKgPerHa, "fieldAreasHa");
  aligned(input.fieldAreasHa, input.handlingLossFractions, "fieldAreasHa");
  if (input.handlingLossFractions.some((v) => v === 1))
    simpleError("handlingLossFractions", "Handling loss below one required.");
  const fieldGrossSeedRequirementsKg = input.fieldAreasHa.map(
      (a, i) =>
        (a * input.calibratedSeedRatesKgPerHa[i]) /
        (1 - input.handlingLossFractions[i]),
    ),
    totalGrossSeedRequirementKg = fieldGrossSeedRequirementsKg.reduce(
      (a, b) => a + b,
      0,
    ),
    wholeBagCount = Math.ceil(
      totalGrossSeedRequirementKg / input.seedBagMassKg,
    );
  count(wholeBagCount, "wholeBagCount");
  return {
    fieldGrossSeedRequirementsKg,
    totalGrossSeedRequirementKg,
    wholeBagCount,
    seedMassRemainderKg:
      wholeBagCount * input.seedBagMassKg - totalGrossSeedRequirementKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fieldAreasHa: [1, 2],
  calibratedSeedRatesKgPerHa: [10, 20],
  handlingLossFractions: [0.2, 0],
  seedBagMassKg: 10,
} satisfies Input;
export const exampleOutput = {
  fieldGrossSeedRequirementsKg: [12.5, 40],
  totalGrossSeedRequirementKg: 52.5,
  wholeBagCount: 6,
  seedMassRemainderKg: 7.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/seed-requirement",
  title: "Agriculture Seed Requirement",
  description:
    "Aggregate caller calibrated field seed mass with handling loss and whole-bag rounding; unlike seeding-rate inversion, established-stand biology is not inferred from supplied rates.",
  inputs: inputFields,
  outputs: [
    {
      id: "fieldGrossSeedRequirementsKg",
      label: "Field gross seed requirements kg",
      kind: "numberList",
    },
    {
      id: "totalGrossSeedRequirementKg",
      label: "Total gross seed requirement kg",
      kind: "number",
    },
    { id: "wholeBagCount", label: "Whole bag count", kind: "number" },
    {
      id: "seedMassRemainderKg",
      label: "Seed mass remainder kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      fieldAreasHa: value.fieldAreasHa as readonly number[],
      calibratedSeedRatesKgPerHa:
        value.calibratedSeedRatesKgPerHa as readonly number[],
      handlingLossFractions: value.handlingLossFractions as readonly number[],
      seedBagMassKg: value.seedBagMassKg as number,
    }),
});
export const run = tool.execute;
export default tool;
