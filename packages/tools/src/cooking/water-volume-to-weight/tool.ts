import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedWaterVolumeMl: number;
  readonly callerMatchedWaterDensityGMl: number;
}>;
export type Output = Readonly<{ readonly conditionalMassG: number }>;
const inputFields = [
  {
    id: "observedWaterVolumeMl",
    label: "Observed water volume ml",
    kind: "number",
  },
  {
    id: "callerMatchedWaterDensityGMl",
    label: "Caller matched water density g ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerMatchedWaterDensityGMl, "callerMatchedWaterDensityGMl");
  nonnegative(input.observedWaterVolumeMl, "observedWaterVolumeMl");
  return {
    conditionalMassG:
      input.observedWaterVolumeMl * input.callerMatchedWaterDensityGMl,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWaterVolumeMl: 100,
  callerMatchedWaterDensityGMl: 1.02,
} satisfies Input;
export const exampleOutput = { conditionalMassG: 102 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/water-volume-to-weight",
  title: "Cooking Water Volume To Weight Calculator",
  description:
    "Measured water volume times independently matching temperature/composition density; volume and mass not assumed interchangeable. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    { id: "conditionalMassG", label: "Conditional mass g", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedWaterVolumeMl: value.observedWaterVolumeMl as number,
      callerMatchedWaterDensityGMl:
        value.callerMatchedWaterDensityGMl as number,
    }),
});
export const run = tool.execute;
export default tool;
