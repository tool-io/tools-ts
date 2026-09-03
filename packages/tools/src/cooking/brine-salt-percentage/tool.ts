import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  weightedComposition,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedBrineIngredientMassesG: readonly number[];
  readonly independentIngredientSaltMassFractions: readonly number[];
}>;
export type Output = Readonly<{ readonly brineSaltMassPercent: number }>;
const inputFields = [
  {
    id: "observedBrineIngredientMassesG",
    label: "Observed brine ingredient masses g",
    kind: "numberList",
  },
  {
    id: "independentIngredientSaltMassFractions",
    label: "Independent ingredient salt mass fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    brineSaltMassPercent:
      100 *
      weightedComposition(
        input.observedBrineIngredientMassesG,
        input.independentIngredientSaltMassFractions,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBrineIngredientMassesG: [10, 90],
  independentIngredientSaltMassFractions: [1, 0],
} satisfies Input;
export const exampleOutput = { brineSaltMassPercent: 10 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/brine-salt-percentage",
  title: "Cooking Brine Salt Percentage Calculator",
  description:
    "Whole brine ingredient mass balance using independent salt assays, including nonsalt solids; no salt/water denominator confusion or preservation guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "brineSaltMassPercent",
      label: "Brine salt mass percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBrineIngredientMassesG:
        value.observedBrineIngredientMassesG as readonly number[],
      independentIngredientSaltMassFractions:
        value.independentIngredientSaltMassFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
