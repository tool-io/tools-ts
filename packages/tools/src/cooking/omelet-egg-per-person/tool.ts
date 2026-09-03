import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  integer,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerOmeletServings: number;
  readonly callerEdibleEggMassPerServingG: number;
  readonly observedMeanEdibleMassPerEggG: number;
}>;
export type Output = Readonly<{
  readonly wholeEggCount: number;
  readonly conditionalEdibleEggMassG: number;
}>;
const inputFields = [
  {
    id: "callerOmeletServings",
    label: "Caller omelet servings",
    kind: "number",
  },
  {
    id: "callerEdibleEggMassPerServingG",
    label: "Caller edible egg mass per serving g",
    kind: "number",
  },
  {
    id: "observedMeanEdibleMassPerEggG",
    label: "Observed mean edible mass per egg g",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedMeanEdibleMassPerEggG,
    "observedMeanEdibleMassPerEggG",
  );
  nonnegative(
    input.callerEdibleEggMassPerServingG,
    "callerEdibleEggMassPerServingG",
  );
  bounded(input.callerOmeletServings, "servings", 0, 10000);
  const n = integer(
    Math.ceil(
      (input.callerOmeletServings * input.callerEdibleEggMassPerServingG) /
        input.observedMeanEdibleMassPerEggG,
    ),
    "eggs",
  );
  return {
    wholeEggCount: n,
    conditionalEdibleEggMassG: n * input.observedMeanEdibleMassPerEggG,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerOmeletServings: 3,
  callerEdibleEggMassPerServingG: 100,
  observedMeanEdibleMassPerEggG: 60,
} satisfies Input;
export const exampleOutput = {
  wholeEggCount: 5,
  conditionalEdibleEggMassG: 300,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/omelet-egg-per-person",
  title: "Cooking Omelet Egg Per Person Calculator",
  description:
    "Whole-egg allocation from caller edible mass per serving and measured edible egg mass, not count multiplication ignoring egg size/shell. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    { id: "wholeEggCount", label: "Whole egg count", kind: "number" },
    {
      id: "conditionalEdibleEggMassG",
      label: "Conditional edible egg mass g",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerOmeletServings: value.callerOmeletServings as number,
      callerEdibleEggMassPerServingG:
        value.callerEdibleEggMassPerServingG as number,
      observedMeanEdibleMassPerEggG:
        value.observedMeanEdibleMassPerEggG as number,
    }),
});
export const run = tool.execute;
export default tool;
