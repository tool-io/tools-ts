import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedTempuraWaterMassG: number;
  readonly observedFlourMassG: number;
  readonly callerTempuraWaterPerFlourMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedTempuraWaterMassG",
    label: "Observed tempura water mass g",
    kind: "number",
  },
  { id: "observedFlourMassG", label: "Observed flour mass g", kind: "number" },
  {
    id: "callerTempuraWaterPerFlourMassRatio",
    label: "Caller tempura water per flour mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedFlourMassG, "observedFlourMassG");
  nonnegative(input.observedTempuraWaterMassG, "observedTempuraWaterMassG");
  nonnegative(
    input.callerTempuraWaterPerFlourMassRatio,
    "callerTempuraWaterPerFlourMassRatio",
  );
  return {
    observedMassRatio:
      input.observedTempuraWaterMassG / input.observedFlourMassG,
    signedRecipeMassDiscrepancyG:
      input.observedTempuraWaterMassG -
      input.observedFlourMassG * input.callerTempuraWaterPerFlourMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTempuraWaterMassG: 20,
  observedFlourMassG: 100,
  callerTempuraWaterPerFlourMassRatio: 0.15,
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
  id: "cooking/tempura-batter-ratio",
  title: "Cooking Tempura Batter Ratio Calculator",
  description:
    "Audit actual TempuraWater/Flour ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedTempuraWaterMassG: value.observedTempuraWaterMassG as number,
      observedFlourMassG: value.observedFlourMassG as number,
      callerTempuraWaterPerFlourMassRatio:
        value.callerTempuraWaterPerFlourMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
