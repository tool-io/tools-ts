import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  weightedComposition,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedBrothIngredientMassesG: readonly number[];
  readonly independentSaltMassFractions: readonly number[];
}>;
export type Output = Readonly<{ readonly brothSaltMassPercent: number }>;
const inputFields = [
  {
    id: "observedBrothIngredientMassesG",
    label: "Observed broth ingredient masses g",
    kind: "numberList",
  },
  {
    id: "independentSaltMassFractions",
    label: "Independent salt mass fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    brothSaltMassPercent:
      100 *
      weightedComposition(
        input.observedBrothIngredientMassesG,
        input.independentSaltMassFractions,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBrothIngredientMassesG: [900, 100],
  independentSaltMassFractions: [0.01, 0.1],
} satisfies Input;
export const exampleOutput = { brothSaltMassPercent: 1.9 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/ramen-broth-salt-percentage",
  title: "Cooking Ramen Broth Salt Percentage Calculator",
  description:
    "Whole prepared broth salt mass balance including separately assayed tare/sauce ingredients, not initial salt/water ratio or sodium estimate. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "brothSaltMassPercent",
      label: "Broth salt mass percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBrothIngredientMassesG:
        value.observedBrothIngredientMassesG as readonly number[],
      independentSaltMassFractions:
        value.independentSaltMassFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
