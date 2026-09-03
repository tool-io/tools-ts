import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedSugarMassG: number;
  readonly callerMatchedSugarGramsPerCup: number;
}>;
export type Output = Readonly<{ readonly conditionalCups: number }>;
const inputFields = [
  { id: "observedSugarMassG", label: "Observed sugar mass g", kind: "number" },
  {
    id: "callerMatchedSugarGramsPerCup",
    label: "Caller matched sugar grams per cup",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMatchedSugarGramsPerCup,
    "callerMatchedSugarGramsPerCup",
  );
  nonnegative(input.observedSugarMassG, "observedSugarMassG");
  return {
    conditionalCups:
      input.observedSugarMassG / input.callerMatchedSugarGramsPerCup,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSugarMassG: 300,
  callerMatchedSugarGramsPerCup: 150,
} satisfies Input;
export const exampleOutput = { conditionalCups: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/sugar-weight-to-cups",
  title: "Cooking Sugar Weight To Cups Calculator",
  description:
    "Mass to cups from independently measured same-ingredient/scoop/packing cup-mass calibration, not a fixed universal density. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    { id: "conditionalCups", label: "Conditional cups", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedSugarMassG: value.observedSugarMassG as number,
      callerMatchedSugarGramsPerCup:
        value.callerMatchedSugarGramsPerCup as number,
    }),
});
export const run = tool.execute;
export default tool;
