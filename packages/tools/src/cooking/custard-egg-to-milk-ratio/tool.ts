import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedCustardEggMassG: number;
  readonly observedMilkMassG: number;
  readonly callerCustardEggPerMilkMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedCustardEggMassG",
    label: "Observed custard egg mass g",
    kind: "number",
  },
  { id: "observedMilkMassG", label: "Observed milk mass g", kind: "number" },
  {
    id: "callerCustardEggPerMilkMassRatio",
    label: "Caller custard egg per milk mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedMilkMassG, "observedMilkMassG");
  nonnegative(input.observedCustardEggMassG, "observedCustardEggMassG");
  nonnegative(
    input.callerCustardEggPerMilkMassRatio,
    "callerCustardEggPerMilkMassRatio",
  );
  return {
    observedMassRatio: input.observedCustardEggMassG / input.observedMilkMassG,
    signedRecipeMassDiscrepancyG:
      input.observedCustardEggMassG -
      input.observedMilkMassG * input.callerCustardEggPerMilkMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCustardEggMassG: 20,
  observedMilkMassG: 100,
  callerCustardEggPerMilkMassRatio: 0.15,
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
  id: "cooking/custard-egg-to-milk-ratio",
  title: "Cooking Custard Egg To Milk Ratio Calculator",
  description:
    "Audit actual CustardEgg/Milk ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedCustardEggMassG: value.observedCustardEggMassG as number,
      observedMilkMassG: value.observedMilkMassG as number,
      callerCustardEggPerMilkMassRatio:
        value.callerCustardEggPerMilkMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
