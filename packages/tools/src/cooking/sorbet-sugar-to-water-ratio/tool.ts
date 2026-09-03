import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedSorbetSugarMassG: number;
  readonly observedWaterMassG: number;
  readonly callerSorbetSugarPerWaterMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedSorbetSugarMassG",
    label: "Observed sorbet sugar mass g",
    kind: "number",
  },
  { id: "observedWaterMassG", label: "Observed water mass g", kind: "number" },
  {
    id: "callerSorbetSugarPerWaterMassRatio",
    label: "Caller sorbet sugar per water mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedWaterMassG, "observedWaterMassG");
  nonnegative(input.observedSorbetSugarMassG, "observedSorbetSugarMassG");
  nonnegative(
    input.callerSorbetSugarPerWaterMassRatio,
    "callerSorbetSugarPerWaterMassRatio",
  );
  return {
    observedMassRatio:
      input.observedSorbetSugarMassG / input.observedWaterMassG,
    signedRecipeMassDiscrepancyG:
      input.observedSorbetSugarMassG -
      input.observedWaterMassG * input.callerSorbetSugarPerWaterMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSorbetSugarMassG: 20,
  observedWaterMassG: 100,
  callerSorbetSugarPerWaterMassRatio: 0.15,
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
  id: "cooking/sorbet-sugar-to-water-ratio",
  title: "Cooking Sorbet Sugar To Water Ratio Calculator",
  description:
    "Audit actual SorbetSugar/Water ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedSorbetSugarMassG: value.observedSorbetSugarMassG as number,
      observedWaterMassG: value.observedWaterMassG as number,
      callerSorbetSugarPerWaterMassRatio:
        value.callerSorbetSugarPerWaterMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
