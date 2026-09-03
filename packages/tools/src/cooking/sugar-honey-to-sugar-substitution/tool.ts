import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedSugarToReplaceG: number;
  readonly callerHoneyRelativeSweetness: number;
  readonly independentHoneyWaterFraction: number;
}>;
export type Output = Readonly<{
  readonly conditionalHoneyMassG: number;
  readonly conditionalIntroducedWaterG: number;
}>;
const inputFields = [
  {
    id: "observedSugarToReplaceG",
    label: "Observed sugar to replace g",
    kind: "number",
  },
  {
    id: "callerHoneyRelativeSweetness",
    label: "Caller honey relative sweetness",
    kind: "number",
  },
  {
    id: "independentHoneyWaterFraction",
    label: "Independent honey water fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerHoneyRelativeSweetness, "callerHoneyRelativeSweetness");
  nonnegative(input.observedSugarToReplaceG, "observedSugarToReplaceG");
  fraction(
    input.independentHoneyWaterFraction,
    "independentHoneyWaterFraction",
  );
  const h = input.observedSugarToReplaceG / input.callerHoneyRelativeSweetness;
  return {
    conditionalHoneyMassG: h,
    conditionalIntroducedWaterG: h * input.independentHoneyWaterFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSugarToReplaceG: 100,
  callerHoneyRelativeSweetness: 1.25,
  independentHoneyWaterFraction: 0.2,
} satisfies Input;
export const exampleOutput = {
  conditionalHoneyMassG: 80,
  conditionalIntroducedWaterG: 16,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/sugar-honey-to-sugar-substitution",
  title: "Cooking Sugar Honey To Sugar Substitution Calculator",
  description:
    "Honey sensory sweetness substitution includes independent introduced-water balance, no universal equal-mass sugar replacement or baking-time correction. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalHoneyMassG",
      label: "Conditional honey mass g",
      kind: "number",
    },
    {
      id: "conditionalIntroducedWaterG",
      label: "Conditional introduced water g",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSugarToReplaceG: value.observedSugarToReplaceG as number,
      callerHoneyRelativeSweetness:
        value.callerHoneyRelativeSweetness as number,
      independentHoneyWaterFraction:
        value.independentHoneyWaterFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
