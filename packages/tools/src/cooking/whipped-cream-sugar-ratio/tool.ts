import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedWhippedCreamSugarMassG: number;
  readonly observedCreamMassG: number;
  readonly callerWhippedCreamSugarPerCreamMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedWhippedCreamSugarMassG",
    label: "Observed whipped cream sugar mass g",
    kind: "number",
  },
  { id: "observedCreamMassG", label: "Observed cream mass g", kind: "number" },
  {
    id: "callerWhippedCreamSugarPerCreamMassRatio",
    label: "Caller whipped cream sugar per cream mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedCreamMassG, "observedCreamMassG");
  nonnegative(
    input.observedWhippedCreamSugarMassG,
    "observedWhippedCreamSugarMassG",
  );
  nonnegative(
    input.callerWhippedCreamSugarPerCreamMassRatio,
    "callerWhippedCreamSugarPerCreamMassRatio",
  );
  return {
    observedMassRatio:
      input.observedWhippedCreamSugarMassG / input.observedCreamMassG,
    signedRecipeMassDiscrepancyG:
      input.observedWhippedCreamSugarMassG -
      input.observedCreamMassG * input.callerWhippedCreamSugarPerCreamMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWhippedCreamSugarMassG: 20,
  observedCreamMassG: 100,
  callerWhippedCreamSugarPerCreamMassRatio: 0.15,
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
  id: "cooking/whipped-cream-sugar-ratio",
  title: "Cooking Whipped Cream Sugar Ratio Calculator",
  description:
    "Audit actual WhippedCreamSugar/Cream ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedWhippedCreamSugarMassG:
        value.observedWhippedCreamSugarMassG as number,
      observedCreamMassG: value.observedCreamMassG as number,
      callerWhippedCreamSugarPerCreamMassRatio:
        value.callerWhippedCreamSugarPerCreamMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
