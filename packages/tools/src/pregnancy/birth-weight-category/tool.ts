import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredBirthWeightGrams: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredBirthWeightGrams",
    label: "Independently measured birth weight grams",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyMeasuredBirthWeightGrams, "weight");
  return {
    conventionalBirthWeightCategory:
      input.independentlyMeasuredBirthWeightGrams < 1000
        ? "extremely-low-under1000g"
        : input.independentlyMeasuredBirthWeightGrams < 1500
          ? "very-low-under1500g"
          : input.independentlyMeasuredBirthWeightGrams < 2500
            ? "low-under2500g"
            : "at-or-above2500g",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyMeasuredBirthWeightGrams: 2400 },
  output: { result: { conventionalBirthWeightCategory: "low-under2500g" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/birth-weight-category",
  title: "Birth Weight Category Lookup",
  description:
    "Conventional WHO-style measured-birthweight definitions, strictly below1000/1500/2500gand hierarchically most specific. Not gestational-age percentile, small-for-age diagnosis, viability or claim\u22652500gis universally healthy.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
