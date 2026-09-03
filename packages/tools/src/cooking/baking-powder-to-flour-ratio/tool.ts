import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedBakingPowderMassG: number;
  readonly observedFlourMassG: number;
  readonly callerBakingPowderPerFlourMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedBakingPowderMassG",
    label: "Observed baking powder mass g",
    kind: "number",
  },
  { id: "observedFlourMassG", label: "Observed flour mass g", kind: "number" },
  {
    id: "callerBakingPowderPerFlourMassRatio",
    label: "Caller baking powder per flour mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedFlourMassG, "observedFlourMassG");
  nonnegative(input.observedBakingPowderMassG, "observedBakingPowderMassG");
  nonnegative(
    input.callerBakingPowderPerFlourMassRatio,
    "callerBakingPowderPerFlourMassRatio",
  );
  return {
    observedMassRatio:
      input.observedBakingPowderMassG / input.observedFlourMassG,
    signedRecipeMassDiscrepancyG:
      input.observedBakingPowderMassG -
      input.observedFlourMassG * input.callerBakingPowderPerFlourMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBakingPowderMassG: 20,
  observedFlourMassG: 100,
  callerBakingPowderPerFlourMassRatio: 0.15,
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
  id: "cooking/baking-powder-to-flour-ratio",
  title: "Cooking Baking Powder To Flour Ratio Calculator",
  description:
    "Audit actual BakingPowder/Flour ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedBakingPowderMassG: value.observedBakingPowderMassG as number,
      observedFlourMassG: value.observedFlourMassG as number,
      callerBakingPowderPerFlourMassRatio:
        value.callerBakingPowderPerFlourMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
