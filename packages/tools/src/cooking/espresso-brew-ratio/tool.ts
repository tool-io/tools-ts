import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedDryCoffeeDoseG: number;
  readonly observedEspressoBeverageYieldG: number;
  readonly independentlyMeasuredBeverageSolidsFraction: number;
}>;
export type Output = Readonly<{
  readonly beverageDoseMassRatio: number;
  readonly conditionalExtractionYieldPercent: number;
}>;
const inputFields = [
  {
    id: "observedDryCoffeeDoseG",
    label: "Observed dry coffee dose g",
    kind: "number",
  },
  {
    id: "observedEspressoBeverageYieldG",
    label: "Observed espresso beverage yield g",
    kind: "number",
  },
  {
    id: "independentlyMeasuredBeverageSolidsFraction",
    label: "Independently measured beverage solids fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedDryCoffeeDoseG, "observedDryCoffeeDoseG");
  nonnegative(
    input.observedEspressoBeverageYieldG,
    "observedEspressoBeverageYieldG",
  );
  fraction(
    input.independentlyMeasuredBeverageSolidsFraction,
    "independentlyMeasuredBeverageSolidsFraction",
  );
  return {
    beverageDoseMassRatio:
      input.observedEspressoBeverageYieldG / input.observedDryCoffeeDoseG,
    conditionalExtractionYieldPercent:
      (100 *
        input.observedEspressoBeverageYieldG *
        input.independentlyMeasuredBeverageSolidsFraction) /
      input.observedDryCoffeeDoseG,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDryCoffeeDoseG: 20,
  observedEspressoBeverageYieldG: 40,
  independentlyMeasuredBeverageSolidsFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  beverageDoseMassRatio: 2,
  conditionalExtractionYieldPercent: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/espresso-brew-ratio",
  title: "Cooking Espresso Brew Ratio Calculator",
  description:
    "Actual espresso yield/dose and independently assayed solids extraction, not water-input ratio used for immersion/pour-over recipes. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "beverageDoseMassRatio",
      label: "Beverage dose mass ratio",
      kind: "number",
    },
    {
      id: "conditionalExtractionYieldPercent",
      label: "Conditional extraction yield percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDryCoffeeDoseG: value.observedDryCoffeeDoseG as number,
      observedEspressoBeverageYieldG:
        value.observedEspressoBeverageYieldG as number,
      independentlyMeasuredBeverageSolidsFraction:
        value.independentlyMeasuredBeverageSolidsFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
