import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly manureWetMassTonnes: number;
  readonly manureDryMatterFraction: number;
  readonly dryBasisNutrientFractions: readonly number[];
  readonly firstYearAvailableNutrientFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalDeclaredNutrientMassesKg: readonly number[];
  readonly firstYearModelAvailableNutrientMassesKg: readonly number[];
}>;
const inputFields = [
  {
    id: "manureWetMassTonnes",
    label: "Manure wet mass tonnes",
    kind: "number",
  },
  {
    id: "manureDryMatterFraction",
    label: "Manure dry matter fraction",
    kind: "number",
  },
  {
    id: "dryBasisNutrientFractions",
    label: "Dry basis nutrient fractions",
    kind: "numberList",
  },
  {
    id: "firstYearAvailableNutrientFractions",
    label: "First year available nutrient fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.manureWetMassTonnes, "manureWetMassTonnes");
  fraction(input.manureDryMatterFraction, "manureDryMatterFraction");
  input.dryBasisNutrientFractions.forEach((v) =>
    fraction(v, "dryBasisNutrientFractions"),
  );
  input.firstYearAvailableNutrientFractions.forEach((v) =>
    fraction(v, "firstYearAvailableNutrientFractions"),
  );
  aligned(
    input.dryBasisNutrientFractions,
    input.firstYearAvailableNutrientFractions,
    "dryBasisNutrientFractions",
  );
  if (input.dryBasisNutrientFractions.reduce((a, b) => a + b, 0) > 1)
    simpleError(
      "nutrients",
      "Declared independent elemental fractions cannot exceed dry mass.",
    );
  const totalDeclaredNutrientMassesKg = input.dryBasisNutrientFractions.map(
    (v) => 1000 * input.manureWetMassTonnes * input.manureDryMatterFraction * v,
  );
  return {
    totalDeclaredNutrientMassesKg,
    firstYearModelAvailableNutrientMassesKg: totalDeclaredNutrientMassesKg.map(
      (v, i) => v * input.firstYearAvailableNutrientFractions[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  manureWetMassTonnes: 10,
  manureDryMatterFraction: 0.2,
  dryBasisNutrientFractions: [0.1, 0.05],
  firstYearAvailableNutrientFractions: [0.5, 0.2],
} satisfies Input;
export const exampleOutput = {
  totalDeclaredNutrientMassesKg: [200, 100],
  firstYearModelAvailableNutrientMassesKg: [100, 20],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/manure-nutrient-content",
  title: "Agriculture Manure Nutrient Content",
  description:
    "Account declared independent dry-basis manure nutrient components from wet mass and model first-year availability; elemental/oxide bases must be consistent and release fractions are not nutrient sufficiency recommendations.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalDeclaredNutrientMassesKg",
      label: "Total declared nutrient masses kg",
      kind: "numberList",
    },
    {
      id: "firstYearModelAvailableNutrientMassesKg",
      label: "First year model available nutrient masses kg",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      manureWetMassTonnes: value.manureWetMassTonnes as number,
      manureDryMatterFraction: value.manureDryMatterFraction as number,
      dryBasisNutrientFractions:
        value.dryBasisNutrientFractions as readonly number[],
      firstYearAvailableNutrientFractions:
        value.firstYearAvailableNutrientFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
