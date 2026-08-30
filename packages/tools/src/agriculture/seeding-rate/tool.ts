import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly targetEstablishedPlantsPerM2: number;
  readonly pureSeedFraction: number;
  readonly germinationFraction: number;
  readonly fieldEstablishmentFraction: number;
  readonly thousandSeedMassGrams: number;
}>;
export type Output = Readonly<{
  readonly requiredSownSeedsPerM2: number;
  readonly requiredSeedMassKgPerHa: number;
}>;
const inputFields = [
  {
    id: "targetEstablishedPlantsPerM2",
    label: "Target established plants per m2",
    kind: "number",
  },
  { id: "pureSeedFraction", label: "Pure seed fraction", kind: "number" },
  { id: "germinationFraction", label: "Germination fraction", kind: "number" },
  {
    id: "fieldEstablishmentFraction",
    label: "Field establishment fraction",
    kind: "number",
  },
  {
    id: "thousandSeedMassGrams",
    label: "Thousand seed mass grams",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.pureSeedFraction, "pureSeedFraction");
  positive(input.germinationFraction, "germinationFraction");
  positive(input.fieldEstablishmentFraction, "fieldEstablishmentFraction");
  positive(input.thousandSeedMassGrams, "thousandSeedMassGrams");
  nonnegative(
    input.targetEstablishedPlantsPerM2,
    "targetEstablishedPlantsPerM2",
  );
  fraction(input.pureSeedFraction, "pureSeedFraction");
  fraction(input.germinationFraction, "germinationFraction");
  fraction(input.fieldEstablishmentFraction, "fieldEstablishmentFraction");
  const requiredSownSeedsPerM2 =
    input.targetEstablishedPlantsPerM2 /
    (input.pureSeedFraction *
      input.germinationFraction *
      input.fieldEstablishmentFraction);
  return {
    requiredSownSeedsPerM2,
    requiredSeedMassKgPerHa:
      (requiredSownSeedsPerM2 * input.thousandSeedMassGrams) / 100,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetEstablishedPlantsPerM2: 100,
  pureSeedFraction: 0.8,
  germinationFraction: 0.5,
  fieldEstablishmentFraction: 0.5,
  thousandSeedMassGrams: 20,
} satisfies Input;
export const exampleOutput = {
  requiredSownSeedsPerM2: 500,
  requiredSeedMassKgPerHa: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/seeding-rate",
  title: "Agriculture Seeding Rate",
  description:
    "Calculate field seed-count/mass requirements from target established stand with separate purity, laboratory germination and field-establishment assumptions; differs from tray-based sowing and is not a species seeding recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredSownSeedsPerM2",
      label: "Required sown seeds per m2",
      kind: "number",
    },
    {
      id: "requiredSeedMassKgPerHa",
      label: "Required seed mass kg per ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      targetEstablishedPlantsPerM2:
        value.targetEstablishedPlantsPerM2 as number,
      pureSeedFraction: value.pureSeedFraction as number,
      germinationFraction: value.germinationFraction as number,
      fieldEstablishmentFraction: value.fieldEstablishmentFraction as number,
      thousandSeedMassGrams: value.thousandSeedMassGrams as number,
    }),
});
export const run = tool.execute;
export default tool;
