import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedFlourMassG: number;
  readonly observedRouxFatMassG: number;
  readonly callerFlourPerRouxFatMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  { id: "observedFlourMassG", label: "Observed flour mass g", kind: "number" },
  {
    id: "observedRouxFatMassG",
    label: "Observed roux fat mass g",
    kind: "number",
  },
  {
    id: "callerFlourPerRouxFatMassRatio",
    label: "Caller flour per roux fat mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedRouxFatMassG, "observedRouxFatMassG");
  nonnegative(input.observedFlourMassG, "observedFlourMassG");
  nonnegative(
    input.callerFlourPerRouxFatMassRatio,
    "callerFlourPerRouxFatMassRatio",
  );
  return {
    observedMassRatio: input.observedFlourMassG / input.observedRouxFatMassG,
    signedRecipeMassDiscrepancyG:
      input.observedFlourMassG -
      input.observedRouxFatMassG * input.callerFlourPerRouxFatMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFlourMassG: 20,
  observedRouxFatMassG: 100,
  callerFlourPerRouxFatMassRatio: 0.15,
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
  id: "cooking/roux-ratio",
  title: "Cooking Roux Ratio Calculator",
  description:
    "Audit actual Flour/RouxFat ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedFlourMassG: value.observedFlourMassG as number,
      observedRouxFatMassG: value.observedRouxFatMassG as number,
      callerFlourPerRouxFatMassRatio:
        value.callerFlourPerRouxFatMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
