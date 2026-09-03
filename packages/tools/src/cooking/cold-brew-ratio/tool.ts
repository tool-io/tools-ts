import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedColdBrewWaterMassG: number;
  readonly observedCoffeeMassG: number;
  readonly callerColdBrewWaterPerCoffeeMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedColdBrewWaterMassG",
    label: "Observed cold brew water mass g",
    kind: "number",
  },
  {
    id: "observedCoffeeMassG",
    label: "Observed coffee mass g",
    kind: "number",
  },
  {
    id: "callerColdBrewWaterPerCoffeeMassRatio",
    label: "Caller cold brew water per coffee mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedCoffeeMassG, "observedCoffeeMassG");
  nonnegative(input.observedColdBrewWaterMassG, "observedColdBrewWaterMassG");
  nonnegative(
    input.callerColdBrewWaterPerCoffeeMassRatio,
    "callerColdBrewWaterPerCoffeeMassRatio",
  );
  return {
    observedMassRatio:
      input.observedColdBrewWaterMassG / input.observedCoffeeMassG,
    signedRecipeMassDiscrepancyG:
      input.observedColdBrewWaterMassG -
      input.observedCoffeeMassG * input.callerColdBrewWaterPerCoffeeMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedColdBrewWaterMassG: 20,
  observedCoffeeMassG: 100,
  callerColdBrewWaterPerCoffeeMassRatio: 0.15,
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
  id: "cooking/cold-brew-ratio",
  title: "Cooking Cold Brew Ratio Calculator",
  description:
    "Audit actual ColdBrewWater/Coffee ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedColdBrewWaterMassG: value.observedColdBrewWaterMassG as number,
      observedCoffeeMassG: value.observedCoffeeMassG as number,
      callerColdBrewWaterPerCoffeeMassRatio:
        value.callerColdBrewWaterPerCoffeeMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
