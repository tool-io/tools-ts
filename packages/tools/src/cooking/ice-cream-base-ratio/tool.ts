import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  weightedComposition,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedIceCreamIngredientMassesG: readonly number[];
  readonly independentFatFractions: readonly number[];
  readonly independentSugarFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly baseFatPercent: number;
  readonly baseSugarPercent: number;
}>;
const inputFields = [
  {
    id: "observedIceCreamIngredientMassesG",
    label: "Observed ice cream ingredient masses g",
    kind: "numberList",
  },
  {
    id: "independentFatFractions",
    label: "Independent fat fractions",
    kind: "numberList",
  },
  {
    id: "independentSugarFractions",
    label: "Independent sugar fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedIceCreamIngredientMassesG,
    input.independentSugarFractions,
    "observedIceCreamIngredientMassesG",
  );
  return {
    baseFatPercent:
      100 *
      weightedComposition(
        input.observedIceCreamIngredientMassesG,
        input.independentFatFractions,
      ),
    baseSugarPercent:
      100 *
      weightedComposition(
        input.observedIceCreamIngredientMassesG,
        input.independentSugarFractions,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIceCreamIngredientMassesG: [80, 20],
  independentFatFractions: [0.1, 0.5],
  independentSugarFractions: [0.2, 0],
} satisfies Input;
export const exampleOutput = {
  baseFatPercent: 18,
  baseSugarPercent: 16,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/ice-cream-base-ratio",
  title: "Cooking Ice Cream Base Ratio Calculator",
  description:
    "Ice-cream multiingredient independently assayed fat/sugar mass balance; no frozen texture/overrun or food-safety prediction. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    { id: "baseFatPercent", label: "Base fat percent", kind: "number" },
    { id: "baseSugarPercent", label: "Base sugar percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedIceCreamIngredientMassesG:
        value.observedIceCreamIngredientMassesG as readonly number[],
      independentFatFractions:
        value.independentFatFractions as readonly number[],
      independentSugarFractions:
        value.independentSugarFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
