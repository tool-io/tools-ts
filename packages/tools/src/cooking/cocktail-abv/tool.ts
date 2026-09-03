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
  aligned,
  sum,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedIngredientVolumesMl: readonly number[];
  readonly independentIngredientAbvFractions: readonly number[];
  readonly observedFinalMixedVolumeMl: number;
}>;
export type Output = Readonly<{
  readonly conditionalCocktailAbvPercent: number;
  readonly signedAdditiveVolumeResidualMl: number;
}>;
const inputFields = [
  {
    id: "observedIngredientVolumesMl",
    label: "Observed ingredient volumes ml",
    kind: "numberList",
  },
  {
    id: "independentIngredientAbvFractions",
    label: "Independent ingredient abv fractions",
    kind: "numberList",
  },
  {
    id: "observedFinalMixedVolumeMl",
    label: "Observed final mixed volume ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedFinalMixedVolumeMl, "observedFinalMixedVolumeMl");
  input.observedIngredientVolumesMl.forEach((v) =>
    nonnegative(v, "observedIngredientVolumesMl"),
  );
  input.independentIngredientAbvFractions.forEach((v) =>
    fraction(v, "independentIngredientAbvFractions"),
  );
  aligned(
    input.observedIngredientVolumesMl,
    input.independentIngredientAbvFractions,
    "observedIngredientVolumesMl",
  );
  const e = sum(
    input.observedIngredientVolumesMl.map(
      (v, i) => v * input.independentIngredientAbvFractions[i],
    ),
  );
  if (e > input.observedFinalMixedVolumeMl)
    simpleError("ethanol", "Ethanol-equivalent volume≤observed mixture.");
  return {
    conditionalCocktailAbvPercent: (100 * e) / input.observedFinalMixedVolumeMl,
    signedAdditiveVolumeResidualMl:
      input.observedFinalMixedVolumeMl - sum(input.observedIngredientVolumesMl),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIngredientVolumesMl: [50, 50],
  independentIngredientAbvFractions: [0.4, 0],
  observedFinalMixedVolumeMl: 90,
} satisfies Input;
export const exampleOutput = {
  conditionalCocktailAbvPercent: 22.22222222222222,
  signedAdditiveVolumeResidualMl: -10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/cocktail-abv",
  title: "Cooking Cocktail Abv Calculator",
  description:
    "Cocktail ethanol-equivalent volume balance over OBSERVED final volume, retains additive-volume discrepancy; same reference temperature/no ethanol loss caller verified, not measured legal ABV. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalCocktailAbvPercent",
      label: "Conditional cocktail abv percent",
      kind: "number",
    },
    {
      id: "signedAdditiveVolumeResidualMl",
      label: "Signed additive volume residual ml",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIngredientVolumesMl:
        value.observedIngredientVolumesMl as readonly number[],
      independentIngredientAbvFractions:
        value.independentIngredientAbvFractions as readonly number[],
      observedFinalMixedVolumeMl: value.observedFinalMixedVolumeMl as number,
    }),
});
export const run = tool.execute;
export default tool;
