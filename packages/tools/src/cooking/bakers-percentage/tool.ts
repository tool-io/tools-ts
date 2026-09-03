import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  binary,
  sum,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedIngredientMassesG: readonly number[];
  readonly callerFlourIngredientFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly flourBasisPercentages: readonly number[];
  readonly totalFormulaBakersPercent: number;
}>;
const inputFields = [
  {
    id: "observedIngredientMassesG",
    label: "Observed ingredient masses g",
    kind: "numberList",
  },
  {
    id: "callerFlourIngredientFlags",
    label: "Caller flour ingredient flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedIngredientMassesG.forEach((v) =>
    nonnegative(v, "observedIngredientMassesG"),
  );
  binary(input.callerFlourIngredientFlags, "callerFlourIngredientFlags");
  aligned(
    input.observedIngredientMassesG,
    input.callerFlourIngredientFlags,
    "observedIngredientMassesG",
  );
  const f = positive(
    sum(
      input.observedIngredientMassesG.map(
        (v, i) => v * input.callerFlourIngredientFlags[i],
      ),
    ),
    "identified total flour",
  );
  const p = input.observedIngredientMassesG.map((v) => (100 * v) / f);
  return { flourBasisPercentages: p, totalFormulaBakersPercent: sum(p) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIngredientMassesG: [100, 20, 10],
  callerFlourIngredientFlags: [1, 0, 0],
} satisfies Input;
export const exampleOutput = {
  flourBasisPercentages: [100, 20, 10],
  totalFormulaBakersPercent: 130,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/bakers-percentage",
  title: "Cooking Bakers Percentage Calculator",
  description:
    "Complete observed baker ingredient inventory on separately identified flour denominator; recipe sum may exceed100%, unlike single-water hydration. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "flourBasisPercentages",
      label: "Flour basis percentages",
      kind: "numberList",
    },
    {
      id: "totalFormulaBakersPercent",
      label: "Total formula bakers percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIngredientMassesG:
        value.observedIngredientMassesG as readonly number[],
      callerFlourIngredientFlags:
        value.callerFlourIngredientFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
