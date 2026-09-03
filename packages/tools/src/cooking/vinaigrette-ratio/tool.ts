import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedVinaigretteOilMassG: number;
  readonly observedVinegarMassG: number;
  readonly callerVinaigretteOilPerVinegarMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedVinaigretteOilMassG",
    label: "Observed vinaigrette oil mass g",
    kind: "number",
  },
  {
    id: "observedVinegarMassG",
    label: "Observed vinegar mass g",
    kind: "number",
  },
  {
    id: "callerVinaigretteOilPerVinegarMassRatio",
    label: "Caller vinaigrette oil per vinegar mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedVinegarMassG, "observedVinegarMassG");
  nonnegative(input.observedVinaigretteOilMassG, "observedVinaigretteOilMassG");
  nonnegative(
    input.callerVinaigretteOilPerVinegarMassRatio,
    "callerVinaigretteOilPerVinegarMassRatio",
  );
  return {
    observedMassRatio:
      input.observedVinaigretteOilMassG / input.observedVinegarMassG,
    signedRecipeMassDiscrepancyG:
      input.observedVinaigretteOilMassG -
      input.observedVinegarMassG *
        input.callerVinaigretteOilPerVinegarMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedVinaigretteOilMassG: 20,
  observedVinegarMassG: 100,
  callerVinaigretteOilPerVinegarMassRatio: 0.15,
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
  id: "cooking/vinaigrette-ratio",
  title: "Cooking Vinaigrette Ratio Calculator",
  description:
    "Audit actual VinaigretteOil/Vinegar ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedVinaigretteOilMassG: value.observedVinaigretteOilMassG as number,
      observedVinegarMassG: value.observedVinegarMassG as number,
      callerVinaigretteOilPerVinegarMassRatio:
        value.callerVinaigretteOilPerVinegarMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
