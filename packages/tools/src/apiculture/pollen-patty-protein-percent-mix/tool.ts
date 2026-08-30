import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly targetPattyMassKg: number;
  readonly targetDryMatterProteinFraction: number;
  readonly ingredientDryMatterFractions: readonly number[];
  readonly ingredientDryProteinFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly ingredientWetMassesKg: readonly number[];
  readonly totalDryMatterKg: number;
}>;
const inputFields = [
  { id: "targetPattyMassKg", label: "Target patty mass kg", kind: "number" },
  {
    id: "targetDryMatterProteinFraction",
    label: "Target dry matter protein fraction",
    kind: "number",
  },
  {
    id: "ingredientDryMatterFractions",
    label: "Ingredient dry matter fractions",
    kind: "numberList",
  },
  {
    id: "ingredientDryProteinFractions",
    label: "Ingredient dry protein fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.targetPattyMassKg, "targetPattyMassKg");
  input.ingredientDryMatterFractions.forEach((v) =>
    positive(v, "ingredientDryMatterFractions"),
  );
  fraction(
    input.targetDryMatterProteinFraction,
    "targetDryMatterProteinFraction",
  );
  input.ingredientDryMatterFractions.forEach((v) =>
    fraction(v, "ingredientDryMatterFractions"),
  );
  input.ingredientDryProteinFractions.forEach((v) =>
    fraction(v, "ingredientDryProteinFractions"),
  );
  if (
    input.ingredientDryMatterFractions.length !== 2 ||
    input.ingredientDryProteinFractions.length !== 2
  )
    simpleError(
      "ingredients",
      "Two ingredients required for an identifiable dry-protein blend.",
    );
  const d = input.ingredientDryMatterFractions,
    p = input.ingredientDryProteinFractions,
    t = input.targetDryMatterProteinFraction,
    den = d[0] * (p[0] - t) - d[1] * (p[1] - t);
  if (den === 0)
    simpleError("ingredients", "Target does not identify a unique blend.");
  const first = fraction(
    (-d[1] * (p[1] - t)) / den,
    "targetDryMatterProteinFraction",
  );
  return {
    ingredientWetMassesKg: [
      first * input.targetPattyMassKg,
      (1 - first) * input.targetPattyMassKg,
    ],
    totalDryMatterKg:
      input.targetPattyMassKg * (first * d[0] + (1 - first) * d[1]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetPattyMassKg: 10,
  targetDryMatterProteinFraction: 0.3,
  ingredientDryMatterFractions: [1, 0.5],
  ingredientDryProteinFractions: [0.4, 0.1],
} satisfies Input;
export const exampleOutput = {
  ingredientWetMassesKg: [5, 5],
  totalDryMatterKg: 7.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/pollen-patty-protein-percent-mix",
  title: "Pollen Patty Protein Percent Mix",
  description:
    "Solve a two-ingredient pollen-patty blend at a caller dry-matter protein target with different ingredient moisture; nutritional suitability and feeding quantities are not inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "ingredientWetMassesKg",
      label: "Ingredient wet masses kg",
      kind: "numberList",
    },
    { id: "totalDryMatterKg", label: "Total dry matter kg", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      targetPattyMassKg: value.targetPattyMassKg as number,
      targetDryMatterProteinFraction:
        value.targetDryMatterProteinFraction as number,
      ingredientDryMatterFractions:
        value.ingredientDryMatterFractions as readonly number[],
      ingredientDryProteinFractions:
        value.ingredientDryProteinFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
