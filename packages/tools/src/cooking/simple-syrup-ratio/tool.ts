import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedSyrupSugarMassG: number;
  readonly observedWaterMassG: number;
  readonly callerSyrupSugarPerWaterMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedSyrupSugarMassG",
    label: "Observed syrup sugar mass g",
    kind: "number",
  },
  { id: "observedWaterMassG", label: "Observed water mass g", kind: "number" },
  {
    id: "callerSyrupSugarPerWaterMassRatio",
    label: "Caller syrup sugar per water mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedWaterMassG, "observedWaterMassG");
  nonnegative(input.observedSyrupSugarMassG, "observedSyrupSugarMassG");
  nonnegative(
    input.callerSyrupSugarPerWaterMassRatio,
    "callerSyrupSugarPerWaterMassRatio",
  );
  return {
    observedMassRatio: input.observedSyrupSugarMassG / input.observedWaterMassG,
    signedRecipeMassDiscrepancyG:
      input.observedSyrupSugarMassG -
      input.observedWaterMassG * input.callerSyrupSugarPerWaterMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSyrupSugarMassG: 20,
  observedWaterMassG: 100,
  callerSyrupSugarPerWaterMassRatio: 0.15,
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
  id: "cooking/simple-syrup-ratio",
  title: "Cooking Simple Syrup Ratio Calculator",
  description:
    "Audit actual SyrupSugar/Water ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedSyrupSugarMassG: value.observedSyrupSugarMassG as number,
      observedWaterMassG: value.observedWaterMassG as number,
      callerSyrupSugarPerWaterMassRatio:
        value.callerSyrupSugarPerWaterMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
