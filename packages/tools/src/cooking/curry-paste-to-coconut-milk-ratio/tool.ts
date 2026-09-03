import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedCurryPasteMassG: number;
  readonly observedCoconutMilkMassG: number;
  readonly callerCurryPastePerCoconutMilkMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedCurryPasteMassG",
    label: "Observed curry paste mass g",
    kind: "number",
  },
  {
    id: "observedCoconutMilkMassG",
    label: "Observed coconut milk mass g",
    kind: "number",
  },
  {
    id: "callerCurryPastePerCoconutMilkMassRatio",
    label: "Caller curry paste per coconut milk mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedCoconutMilkMassG, "observedCoconutMilkMassG");
  nonnegative(input.observedCurryPasteMassG, "observedCurryPasteMassG");
  nonnegative(
    input.callerCurryPastePerCoconutMilkMassRatio,
    "callerCurryPastePerCoconutMilkMassRatio",
  );
  return {
    observedMassRatio:
      input.observedCurryPasteMassG / input.observedCoconutMilkMassG,
    signedRecipeMassDiscrepancyG:
      input.observedCurryPasteMassG -
      input.observedCoconutMilkMassG *
        input.callerCurryPastePerCoconutMilkMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCurryPasteMassG: 20,
  observedCoconutMilkMassG: 100,
  callerCurryPastePerCoconutMilkMassRatio: 0.15,
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
  id: "cooking/curry-paste-to-coconut-milk-ratio",
  title: "Cooking Curry Paste To Coconut Milk Ratio Calculator",
  description:
    "Audit actual CurryPaste/CoconutMilk ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedCurryPasteMassG: value.observedCurryPasteMassG as number,
      observedCoconutMilkMassG: value.observedCoconutMilkMassG as number,
      callerCurryPastePerCoconutMilkMassRatio:
        value.callerCurryPastePerCoconutMilkMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
