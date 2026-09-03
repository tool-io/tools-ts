import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedSushiVinegarMassG: number;
  readonly observedCookedRiceMassG: number;
  readonly callerSushiVinegarPerCookedRiceMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedSushiVinegarMassG",
    label: "Observed sushi vinegar mass g",
    kind: "number",
  },
  {
    id: "observedCookedRiceMassG",
    label: "Observed cooked rice mass g",
    kind: "number",
  },
  {
    id: "callerSushiVinegarPerCookedRiceMassRatio",
    label: "Caller sushi vinegar per cooked rice mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedCookedRiceMassG, "observedCookedRiceMassG");
  nonnegative(input.observedSushiVinegarMassG, "observedSushiVinegarMassG");
  nonnegative(
    input.callerSushiVinegarPerCookedRiceMassRatio,
    "callerSushiVinegarPerCookedRiceMassRatio",
  );
  return {
    observedMassRatio:
      input.observedSushiVinegarMassG / input.observedCookedRiceMassG,
    signedRecipeMassDiscrepancyG:
      input.observedSushiVinegarMassG -
      input.observedCookedRiceMassG *
        input.callerSushiVinegarPerCookedRiceMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSushiVinegarMassG: 20,
  observedCookedRiceMassG: 100,
  callerSushiVinegarPerCookedRiceMassRatio: 0.15,
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
  id: "cooking/sushi-rice-vinegar-ratio",
  title: "Cooking Sushi Rice Vinegar Ratio Calculator",
  description:
    "Audit actual SushiVinegar/CookedRice ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedSushiVinegarMassG: value.observedSushiVinegarMassG as number,
      observedCookedRiceMassG: value.observedCookedRiceMassG as number,
      callerSushiVinegarPerCookedRiceMassRatio:
        value.callerSushiVinegarPerCookedRiceMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
