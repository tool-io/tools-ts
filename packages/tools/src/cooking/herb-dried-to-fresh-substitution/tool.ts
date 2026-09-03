import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedFreshHerbMassG: number;
  readonly independentFreshAromaEquivalentPerG: number;
  readonly independentDryAromaEquivalentPerG: number;
}>;
export type Output = Readonly<{
  readonly conditionalDryHerbEquivalentG: number;
}>;
const inputFields = [
  {
    id: "observedFreshHerbMassG",
    label: "Observed fresh herb mass g",
    kind: "number",
  },
  {
    id: "independentFreshAromaEquivalentPerG",
    label: "Independent fresh aroma equivalent per g",
    kind: "number",
  },
  {
    id: "independentDryAromaEquivalentPerG",
    label: "Independent dry aroma equivalent per g",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.independentFreshAromaEquivalentPerG,
    "independentFreshAromaEquivalentPerG",
  );
  positive(
    input.independentDryAromaEquivalentPerG,
    "independentDryAromaEquivalentPerG",
  );
  nonnegative(input.observedFreshHerbMassG, "observedFreshHerbMassG");
  return {
    conditionalDryHerbEquivalentG:
      (input.observedFreshHerbMassG *
        input.independentFreshAromaEquivalentPerG) /
      input.independentDryAromaEquivalentPerG,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFreshHerbMassG: 10,
  independentFreshAromaEquivalentPerG: 2,
  independentDryAromaEquivalentPerG: 5,
} satisfies Input;
export const exampleOutput = {
  conditionalDryHerbEquivalentG: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/herb-dried-to-fresh-substitution",
  title: "Cooking Herb Dried To Fresh Substitution Calculator",
  description:
    "Herb sensory-equivalence mass substitution from independent same-species/batch aroma calibration, not universal3:1 volume rule. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalDryHerbEquivalentG",
      label: "Conditional dry herb equivalent g",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFreshHerbMassG: value.observedFreshHerbMassG as number,
      independentFreshAromaEquivalentPerG:
        value.independentFreshAromaEquivalentPerG as number,
      independentDryAromaEquivalentPerG:
        value.independentDryAromaEquivalentPerG as number,
    }),
});
export const run = tool.execute;
export default tool;
