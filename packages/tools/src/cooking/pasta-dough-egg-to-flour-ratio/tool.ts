import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedPastaEggMassG: number;
  readonly observedFlourMassG: number;
  readonly callerPastaEggPerFlourMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedPastaEggMassG",
    label: "Observed pasta egg mass g",
    kind: "number",
  },
  { id: "observedFlourMassG", label: "Observed flour mass g", kind: "number" },
  {
    id: "callerPastaEggPerFlourMassRatio",
    label: "Caller pasta egg per flour mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedFlourMassG, "observedFlourMassG");
  nonnegative(input.observedPastaEggMassG, "observedPastaEggMassG");
  nonnegative(
    input.callerPastaEggPerFlourMassRatio,
    "callerPastaEggPerFlourMassRatio",
  );
  return {
    observedMassRatio: input.observedPastaEggMassG / input.observedFlourMassG,
    signedRecipeMassDiscrepancyG:
      input.observedPastaEggMassG -
      input.observedFlourMassG * input.callerPastaEggPerFlourMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPastaEggMassG: 20,
  observedFlourMassG: 100,
  callerPastaEggPerFlourMassRatio: 0.15,
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
  id: "cooking/pasta-dough-egg-to-flour-ratio",
  title: "Cooking Pasta Dough Egg To Flour Ratio Calculator",
  description:
    "Audit actual PastaEgg/Flour ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedPastaEggMassG: value.observedPastaEggMassG as number,
      observedFlourMassG: value.observedFlourMassG as number,
      callerPastaEggPerFlourMassRatio:
        value.callerPastaEggPerFlourMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
