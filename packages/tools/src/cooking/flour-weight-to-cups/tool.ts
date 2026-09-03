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
  readonly callerMatchedFlourGramsPerCup: number;
}>;
export type Output = Readonly<{ readonly conditionalCups: number }>;
const inputFields = [
  { id: "observedFlourMassG", label: "Observed flour mass g", kind: "number" },
  {
    id: "callerMatchedFlourGramsPerCup",
    label: "Caller matched flour grams per cup",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMatchedFlourGramsPerCup,
    "callerMatchedFlourGramsPerCup",
  );
  nonnegative(input.observedFlourMassG, "observedFlourMassG");
  return {
    conditionalCups:
      input.observedFlourMassG / input.callerMatchedFlourGramsPerCup,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFlourMassG: 300,
  callerMatchedFlourGramsPerCup: 150,
} satisfies Input;
export const exampleOutput = { conditionalCups: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/flour-weight-to-cups",
  title: "Cooking Flour Weight To Cups Calculator",
  description:
    "Mass to cups from independently measured same-ingredient/scoop/packing cup-mass calibration, not a fixed universal density. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    { id: "conditionalCups", label: "Conditional cups", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedFlourMassG: value.observedFlourMassG as number,
      callerMatchedFlourGramsPerCup:
        value.callerMatchedFlourGramsPerCup as number,
    }),
});
export const run = tool.execute;
export default tool;
