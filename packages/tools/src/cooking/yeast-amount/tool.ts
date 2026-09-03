import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedFlourMassG: number;
  readonly callerRecipeYeastFraction: number;
  readonly callerSameTypePotencyFactor: number;
}>;
export type Output = Readonly<{
  readonly conditionalEquivalentYeastMassG: number;
}>;
const inputFields = [
  { id: "observedFlourMassG", label: "Observed flour mass g", kind: "number" },
  {
    id: "callerRecipeYeastFraction",
    label: "Caller recipe yeast fraction",
    kind: "number",
  },
  {
    id: "callerSameTypePotencyFactor",
    label: "Caller same type potency factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerSameTypePotencyFactor, "callerSameTypePotencyFactor");
  nonnegative(input.observedFlourMassG, "observedFlourMassG");
  fraction(input.callerRecipeYeastFraction, "callerRecipeYeastFraction");
  return {
    conditionalEquivalentYeastMassG:
      (input.observedFlourMassG * input.callerRecipeYeastFraction) /
      input.callerSameTypePotencyFactor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFlourMassG: 1000,
  callerRecipeYeastFraction: 0.01,
  callerSameTypePotencyFactor: 0.5,
} satisfies Input;
export const exampleOutput = {
  conditionalEquivalentYeastMassG: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/yeast-amount",
  title: "Cooking Yeast Amount Calculator",
  description:
    "Caller recipe flour-basis yeast mass adjusted by independently calibrated selected yeast type potency; no biological proofing/dose recommendation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalEquivalentYeastMassG",
      label: "Conditional equivalent yeast mass g",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFlourMassG: value.observedFlourMassG as number,
      callerRecipeYeastFraction: value.callerRecipeYeastFraction as number,
      callerSameTypePotencyFactor: value.callerSameTypePotencyFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
