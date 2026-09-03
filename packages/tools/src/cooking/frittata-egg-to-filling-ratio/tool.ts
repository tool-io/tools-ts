import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedFrittataEggMassG: number;
  readonly observedFillingMassG: number;
  readonly callerFrittataEggPerFillingMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedFrittataEggMassG",
    label: "Observed frittata egg mass g",
    kind: "number",
  },
  {
    id: "observedFillingMassG",
    label: "Observed filling mass g",
    kind: "number",
  },
  {
    id: "callerFrittataEggPerFillingMassRatio",
    label: "Caller frittata egg per filling mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedFillingMassG, "observedFillingMassG");
  nonnegative(input.observedFrittataEggMassG, "observedFrittataEggMassG");
  nonnegative(
    input.callerFrittataEggPerFillingMassRatio,
    "callerFrittataEggPerFillingMassRatio",
  );
  return {
    observedMassRatio:
      input.observedFrittataEggMassG / input.observedFillingMassG,
    signedRecipeMassDiscrepancyG:
      input.observedFrittataEggMassG -
      input.observedFillingMassG * input.callerFrittataEggPerFillingMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFrittataEggMassG: 20,
  observedFillingMassG: 100,
  callerFrittataEggPerFillingMassRatio: 0.15,
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
  id: "cooking/frittata-egg-to-filling-ratio",
  title: "Cooking Frittata Egg To Filling Ratio Calculator",
  description:
    "Audit actual FrittataEgg/Filling ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedFrittataEggMassG: value.observedFrittataEggMassG as number,
      observedFillingMassG: value.observedFillingMassG as number,
      callerFrittataEggPerFillingMassRatio:
        value.callerFrittataEggPerFillingMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
