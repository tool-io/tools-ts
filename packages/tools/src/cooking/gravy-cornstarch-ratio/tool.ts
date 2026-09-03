import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedGravyCornstarchMassG: number;
  readonly observedLiquidMassG: number;
  readonly callerGravyCornstarchPerLiquidMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedGravyCornstarchMassG",
    label: "Observed gravy cornstarch mass g",
    kind: "number",
  },
  {
    id: "observedLiquidMassG",
    label: "Observed liquid mass g",
    kind: "number",
  },
  {
    id: "callerGravyCornstarchPerLiquidMassRatio",
    label: "Caller gravy cornstarch per liquid mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedLiquidMassG, "observedLiquidMassG");
  nonnegative(
    input.observedGravyCornstarchMassG,
    "observedGravyCornstarchMassG",
  );
  nonnegative(
    input.callerGravyCornstarchPerLiquidMassRatio,
    "callerGravyCornstarchPerLiquidMassRatio",
  );
  return {
    observedMassRatio:
      input.observedGravyCornstarchMassG / input.observedLiquidMassG,
    signedRecipeMassDiscrepancyG:
      input.observedGravyCornstarchMassG -
      input.observedLiquidMassG * input.callerGravyCornstarchPerLiquidMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGravyCornstarchMassG: 20,
  observedLiquidMassG: 100,
  callerGravyCornstarchPerLiquidMassRatio: 0.15,
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
  id: "cooking/gravy-cornstarch-ratio",
  title: "Cooking Gravy Cornstarch Ratio Calculator",
  description:
    "Audit actual GravyCornstarch/Liquid ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedGravyCornstarchMassG:
        value.observedGravyCornstarchMassG as number,
      observedLiquidMassG: value.observedLiquidMassG as number,
      callerGravyCornstarchPerLiquidMassRatio:
        value.callerGravyCornstarchPerLiquidMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
