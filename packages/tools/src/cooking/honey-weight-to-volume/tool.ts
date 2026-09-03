import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedHoneyMassG: number;
  readonly callerSameTemperatureHoneyDensityGMl: number;
}>;
export type Output = Readonly<{ readonly conditionalHoneyVolumeMl: number }>;
const inputFields = [
  { id: "observedHoneyMassG", label: "Observed honey mass g", kind: "number" },
  {
    id: "callerSameTemperatureHoneyDensityGMl",
    label: "Caller same temperature honey density g ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerSameTemperatureHoneyDensityGMl,
    "callerSameTemperatureHoneyDensityGMl",
  );
  nonnegative(input.observedHoneyMassG, "observedHoneyMassG");
  return {
    conditionalHoneyVolumeMl:
      input.observedHoneyMassG / input.callerSameTemperatureHoneyDensityGMl,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHoneyMassG: 140,
  callerSameTemperatureHoneyDensityGMl: 1.4,
} satisfies Input;
export const exampleOutput = { conditionalHoneyVolumeMl: 100 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/honey-weight-to-volume",
  title: "Cooking Honey Weight To Volume Calculator",
  description:
    "Honey mass/density with independently measured same-lot/temperature calibration, not fixed honey-gallon lookup. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalHoneyVolumeMl",
      label: "Conditional honey volume ml",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHoneyMassG: value.observedHoneyMassG as number,
      callerSameTemperatureHoneyDensityGMl:
        value.callerSameTemperatureHoneyDensityGMl as number,
    }),
});
export const run = tool.execute;
export default tool;
