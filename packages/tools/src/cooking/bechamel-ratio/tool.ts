import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedRouxMassG: number;
  readonly observedBechamelMilkMassG: number;
  readonly callerRouxPerBechamelMilkMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  { id: "observedRouxMassG", label: "Observed roux mass g", kind: "number" },
  {
    id: "observedBechamelMilkMassG",
    label: "Observed bechamel milk mass g",
    kind: "number",
  },
  {
    id: "callerRouxPerBechamelMilkMassRatio",
    label: "Caller roux per bechamel milk mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedBechamelMilkMassG, "observedBechamelMilkMassG");
  nonnegative(input.observedRouxMassG, "observedRouxMassG");
  nonnegative(
    input.callerRouxPerBechamelMilkMassRatio,
    "callerRouxPerBechamelMilkMassRatio",
  );
  return {
    observedMassRatio:
      input.observedRouxMassG / input.observedBechamelMilkMassG,
    signedRecipeMassDiscrepancyG:
      input.observedRouxMassG -
      input.observedBechamelMilkMassG *
        input.callerRouxPerBechamelMilkMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRouxMassG: 20,
  observedBechamelMilkMassG: 100,
  callerRouxPerBechamelMilkMassRatio: 0.15,
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
  id: "cooking/bechamel-ratio",
  title: "Cooking Bechamel Ratio Calculator",
  description:
    "Audit actual Roux/BechamelMilk ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedRouxMassG: value.observedRouxMassG as number,
      observedBechamelMilkMassG: value.observedBechamelMilkMassG as number,
      callerRouxPerBechamelMilkMassRatio:
        value.callerRouxPerBechamelMilkMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
