import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedButterMassG: number;
  readonly independentButterFatFraction: number;
  readonly independentButterWaterFraction: number;
  readonly independentOilFatFraction: number;
}>;
export type Output = Readonly<{
  readonly fatMatchedOilG: number;
  readonly removedButterWaterG: number;
}>;
const inputFields = [
  {
    id: "observedButterMassG",
    label: "Observed butter mass g",
    kind: "number",
  },
  {
    id: "independentButterFatFraction",
    label: "Independent butter fat fraction",
    kind: "number",
  },
  {
    id: "independentButterWaterFraction",
    label: "Independent butter water fraction",
    kind: "number",
  },
  {
    id: "independentOilFatFraction",
    label: "Independent oil fat fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.independentOilFatFraction, "independentOilFatFraction");
  nonnegative(input.observedButterMassG, "observedButterMassG");
  fraction(input.independentButterFatFraction, "independentButterFatFraction");
  fraction(
    input.independentButterWaterFraction,
    "independentButterWaterFraction",
  );
  fraction(input.independentOilFatFraction, "oilfat");
  if (
    input.independentButterFatFraction + input.independentButterWaterFraction >
    1
  )
    simpleError("butter", "Fat+water≤1.");
  return {
    fatMatchedOilG:
      (input.observedButterMassG * input.independentButterFatFraction) /
      input.independentOilFatFraction,
    removedButterWaterG:
      input.observedButterMassG * input.independentButterWaterFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedButterMassG: 100,
  independentButterFatFraction: 0.8,
  independentButterWaterFraction: 0.2,
  independentOilFatFraction: 1,
} satisfies Input;
export const exampleOutput = {
  fatMatchedOilG: 80,
  removedButterWaterG: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/butter-oil-substitution",
  title: "Cooking Butter Oil Substitution Calculator",
  description:
    "Butter/oil fat-equivalent substitution reports independently removed butter water, not universal mass/volume exchange. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    { id: "fatMatchedOilG", label: "Fat matched oil g", kind: "number" },
    {
      id: "removedButterWaterG",
      label: "Removed butter water g",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedButterMassG: value.observedButterMassG as number,
      independentButterFatFraction:
        value.independentButterFatFraction as number,
      independentButterWaterFraction:
        value.independentButterWaterFraction as number,
      independentOilFatFraction: value.independentOilFatFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
