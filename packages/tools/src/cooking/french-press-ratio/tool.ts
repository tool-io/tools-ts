import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedFrenchPressWaterMassG: number;
  readonly observedCoffeeMassG: number;
  readonly callerFrenchPressWaterPerCoffeeMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedFrenchPressWaterMassG",
    label: "Observed french press water mass g",
    kind: "number",
  },
  {
    id: "observedCoffeeMassG",
    label: "Observed coffee mass g",
    kind: "number",
  },
  {
    id: "callerFrenchPressWaterPerCoffeeMassRatio",
    label: "Caller french press water per coffee mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedCoffeeMassG, "observedCoffeeMassG");
  nonnegative(
    input.observedFrenchPressWaterMassG,
    "observedFrenchPressWaterMassG",
  );
  nonnegative(
    input.callerFrenchPressWaterPerCoffeeMassRatio,
    "callerFrenchPressWaterPerCoffeeMassRatio",
  );
  return {
    observedMassRatio:
      input.observedFrenchPressWaterMassG / input.observedCoffeeMassG,
    signedRecipeMassDiscrepancyG:
      input.observedFrenchPressWaterMassG -
      input.observedCoffeeMassG *
        input.callerFrenchPressWaterPerCoffeeMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFrenchPressWaterMassG: 20,
  observedCoffeeMassG: 100,
  callerFrenchPressWaterPerCoffeeMassRatio: 0.15,
} satisfies Input;
export const exampleOutput = {
  observedMassRatio: 0.2,
  signedRecipeMassDiscrepancyG: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/french-press-ratio",
  title: "Cooking French Press Ratio Calculator",
  description:
    "Audit actual FrenchPressWater/Coffee ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    { id: "observedMassRatio", label: "Observed mass ratio", kind: "number" },
    {
      id: "signedRecipeMassDiscrepancyG",
      label: "Signed recipe mass discrepancy g",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFrenchPressWaterMassG:
        value.observedFrenchPressWaterMassG as number,
      observedCoffeeMassG: value.observedCoffeeMassG as number,
      callerFrenchPressWaterPerCoffeeMassRatio:
        value.callerFrenchPressWaterPerCoffeeMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
