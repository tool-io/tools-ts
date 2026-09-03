import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedMayonnaiseOilMassG: number;
  readonly observedEggMassG: number;
  readonly callerMayonnaiseOilPerEggMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedMayonnaiseOilMassG",
    label: "Observed mayonnaise oil mass g",
    kind: "number",
  },
  { id: "observedEggMassG", label: "Observed egg mass g", kind: "number" },
  {
    id: "callerMayonnaiseOilPerEggMassRatio",
    label: "Caller mayonnaise oil per egg mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedEggMassG, "observedEggMassG");
  nonnegative(input.observedMayonnaiseOilMassG, "observedMayonnaiseOilMassG");
  nonnegative(
    input.callerMayonnaiseOilPerEggMassRatio,
    "callerMayonnaiseOilPerEggMassRatio",
  );
  return {
    observedMassRatio:
      input.observedMayonnaiseOilMassG / input.observedEggMassG,
    signedRecipeMassDiscrepancyG:
      input.observedMayonnaiseOilMassG -
      input.observedEggMassG * input.callerMayonnaiseOilPerEggMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMayonnaiseOilMassG: 20,
  observedEggMassG: 100,
  callerMayonnaiseOilPerEggMassRatio: 0.15,
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
  id: "cooking/mayonnaise-egg-to-oil-ratio",
  title: "Cooking Mayonnaise Egg To Oil Ratio Calculator",
  description:
    "Audit actual MayonnaiseOil/Egg ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedMayonnaiseOilMassG: value.observedMayonnaiseOilMassG as number,
      observedEggMassG: value.observedEggMassG as number,
      callerMayonnaiseOilPerEggMassRatio:
        value.callerMayonnaiseOilPerEggMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
