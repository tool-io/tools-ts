import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedPourOverWaterMassG: number;
  readonly observedCoffeeMassG: number;
  readonly callerPourOverWaterPerCoffeeMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedPourOverWaterMassG",
    label: "Observed pour over water mass g",
    kind: "number",
  },
  {
    id: "observedCoffeeMassG",
    label: "Observed coffee mass g",
    kind: "number",
  },
  {
    id: "callerPourOverWaterPerCoffeeMassRatio",
    label: "Caller pour over water per coffee mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedCoffeeMassG, "observedCoffeeMassG");
  nonnegative(input.observedPourOverWaterMassG, "observedPourOverWaterMassG");
  nonnegative(
    input.callerPourOverWaterPerCoffeeMassRatio,
    "callerPourOverWaterPerCoffeeMassRatio",
  );
  return {
    observedMassRatio:
      input.observedPourOverWaterMassG / input.observedCoffeeMassG,
    signedRecipeMassDiscrepancyG:
      input.observedPourOverWaterMassG -
      input.observedCoffeeMassG * input.callerPourOverWaterPerCoffeeMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPourOverWaterMassG: 20,
  observedCoffeeMassG: 100,
  callerPourOverWaterPerCoffeeMassRatio: 0.15,
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
  id: "cooking/pour-over-ratio",
  title: "Cooking Pour Over Ratio Calculator",
  description:
    "Audit actual PourOverWater/Coffee ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedPourOverWaterMassG: value.observedPourOverWaterMassG as number,
      observedCoffeeMassG: value.observedCoffeeMassG as number,
      callerPourOverWaterPerCoffeeMassRatio:
        value.callerPourOverWaterPerCoffeeMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
