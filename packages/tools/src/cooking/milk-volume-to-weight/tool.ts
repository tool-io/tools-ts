import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedMilkVolumeMl: number;
  readonly callerMatchedMilkDensityGMl: number;
}>;
export type Output = Readonly<{ readonly conditionalMassG: number }>;
const inputFields = [
  {
    id: "observedMilkVolumeMl",
    label: "Observed milk volume ml",
    kind: "number",
  },
  {
    id: "callerMatchedMilkDensityGMl",
    label: "Caller matched milk density g ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerMatchedMilkDensityGMl, "callerMatchedMilkDensityGMl");
  nonnegative(input.observedMilkVolumeMl, "observedMilkVolumeMl");
  return {
    conditionalMassG:
      input.observedMilkVolumeMl * input.callerMatchedMilkDensityGMl,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMilkVolumeMl: 100,
  callerMatchedMilkDensityGMl: 1.02,
} satisfies Input;
export const exampleOutput = { conditionalMassG: 102 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/milk-volume-to-weight",
  title: "Cooking Milk Volume To Weight Calculator",
  description:
    "Measured milk volume times independently matching temperature/composition density; volume and mass not assumed interchangeable. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    { id: "conditionalMassG", label: "Conditional mass g", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedMilkVolumeMl: value.observedMilkVolumeMl as number,
      callerMatchedMilkDensityGMl: value.callerMatchedMilkDensityGMl as number,
    }),
});
export const run = tool.execute;
export default tool;
