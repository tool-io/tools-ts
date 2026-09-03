import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedQuicheEggMassG: number;
  readonly observedCreamMassG: number;
  readonly callerQuicheEggPerCreamMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedQuicheEggMassG",
    label: "Observed quiche egg mass g",
    kind: "number",
  },
  { id: "observedCreamMassG", label: "Observed cream mass g", kind: "number" },
  {
    id: "callerQuicheEggPerCreamMassRatio",
    label: "Caller quiche egg per cream mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedCreamMassG, "observedCreamMassG");
  nonnegative(input.observedQuicheEggMassG, "observedQuicheEggMassG");
  nonnegative(
    input.callerQuicheEggPerCreamMassRatio,
    "callerQuicheEggPerCreamMassRatio",
  );
  return {
    observedMassRatio: input.observedQuicheEggMassG / input.observedCreamMassG,
    signedRecipeMassDiscrepancyG:
      input.observedQuicheEggMassG -
      input.observedCreamMassG * input.callerQuicheEggPerCreamMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedQuicheEggMassG: 20,
  observedCreamMassG: 100,
  callerQuicheEggPerCreamMassRatio: 0.15,
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
  id: "cooking/quiche-egg-to-cream-ratio",
  title: "Cooking Quiche Egg To Cream Ratio Calculator",
  description:
    "Audit actual QuicheEgg/Cream ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedQuicheEggMassG: value.observedQuicheEggMassG as number,
      observedCreamMassG: value.observedCreamMassG as number,
      callerQuicheEggPerCreamMassRatio:
        value.callerQuicheEggPerCreamMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
