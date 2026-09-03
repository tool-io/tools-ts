import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedBeerMassG: number;
  readonly observedBatterFlourMassG: number;
  readonly callerBeerPerBatterFlourMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  { id: "observedBeerMassG", label: "Observed beer mass g", kind: "number" },
  {
    id: "observedBatterFlourMassG",
    label: "Observed batter flour mass g",
    kind: "number",
  },
  {
    id: "callerBeerPerBatterFlourMassRatio",
    label: "Caller beer per batter flour mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedBatterFlourMassG, "observedBatterFlourMassG");
  nonnegative(input.observedBeerMassG, "observedBeerMassG");
  nonnegative(
    input.callerBeerPerBatterFlourMassRatio,
    "callerBeerPerBatterFlourMassRatio",
  );
  return {
    observedMassRatio: input.observedBeerMassG / input.observedBatterFlourMassG,
    signedRecipeMassDiscrepancyG:
      input.observedBeerMassG -
      input.observedBatterFlourMassG * input.callerBeerPerBatterFlourMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBeerMassG: 20,
  observedBatterFlourMassG: 100,
  callerBeerPerBatterFlourMassRatio: 0.15,
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
  id: "cooking/beer-batter-ratio",
  title: "Cooking Beer Batter Ratio Calculator",
  description:
    "Audit actual Beer/BatterFlour ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedBeerMassG: value.observedBeerMassG as number,
      observedBatterFlourMassG: value.observedBatterFlourMassG as number,
      callerBeerPerBatterFlourMassRatio:
        value.callerBeerPerBatterFlourMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
