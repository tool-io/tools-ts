import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedMeringueSugarMassG: number;
  readonly observedEggWhiteMassG: number;
  readonly callerMeringueSugarPerEggWhiteMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedMeringueSugarMassG",
    label: "Observed meringue sugar mass g",
    kind: "number",
  },
  {
    id: "observedEggWhiteMassG",
    label: "Observed egg white mass g",
    kind: "number",
  },
  {
    id: "callerMeringueSugarPerEggWhiteMassRatio",
    label: "Caller meringue sugar per egg white mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedEggWhiteMassG, "observedEggWhiteMassG");
  nonnegative(input.observedMeringueSugarMassG, "observedMeringueSugarMassG");
  nonnegative(
    input.callerMeringueSugarPerEggWhiteMassRatio,
    "callerMeringueSugarPerEggWhiteMassRatio",
  );
  return {
    observedMassRatio:
      input.observedMeringueSugarMassG / input.observedEggWhiteMassG,
    signedRecipeMassDiscrepancyG:
      input.observedMeringueSugarMassG -
      input.observedEggWhiteMassG *
        input.callerMeringueSugarPerEggWhiteMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMeringueSugarMassG: 20,
  observedEggWhiteMassG: 100,
  callerMeringueSugarPerEggWhiteMassRatio: 0.15,
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
  id: "cooking/meringue-sugar-to-egg-white-ratio",
  title: "Cooking Meringue Sugar To Egg White Ratio Calculator",
  description:
    "Audit actual MeringueSugar/EggWhite ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedMeringueSugarMassG: value.observedMeringueSugarMassG as number,
      observedEggWhiteMassG: value.observedEggWhiteMassG as number,
      callerMeringueSugarPerEggWhiteMassRatio:
        value.callerMeringueSugarPerEggWhiteMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
