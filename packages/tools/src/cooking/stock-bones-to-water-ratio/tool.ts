import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedStockWaterMassG: number;
  readonly observedBonesMassG: number;
  readonly callerStockWaterPerBonesMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedStockWaterMassG",
    label: "Observed stock water mass g",
    kind: "number",
  },
  { id: "observedBonesMassG", label: "Observed bones mass g", kind: "number" },
  {
    id: "callerStockWaterPerBonesMassRatio",
    label: "Caller stock water per bones mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedBonesMassG, "observedBonesMassG");
  nonnegative(input.observedStockWaterMassG, "observedStockWaterMassG");
  nonnegative(
    input.callerStockWaterPerBonesMassRatio,
    "callerStockWaterPerBonesMassRatio",
  );
  return {
    observedMassRatio: input.observedStockWaterMassG / input.observedBonesMassG,
    signedRecipeMassDiscrepancyG:
      input.observedStockWaterMassG -
      input.observedBonesMassG * input.callerStockWaterPerBonesMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedStockWaterMassG: 20,
  observedBonesMassG: 100,
  callerStockWaterPerBonesMassRatio: 0.15,
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
  id: "cooking/stock-bones-to-water-ratio",
  title: "Cooking Stock Bones To Water Ratio Calculator",
  description:
    "Audit actual StockWater/Bones ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedStockWaterMassG: value.observedStockWaterMassG as number,
      observedBonesMassG: value.observedBonesMassG as number,
      callerStockWaterPerBonesMassRatio:
        value.callerStockWaterPerBonesMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
