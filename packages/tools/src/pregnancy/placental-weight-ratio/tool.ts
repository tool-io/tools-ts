import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredPlacentalMassGrams: number;
  readonly independentlyMatchedBirthMassGrams: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredPlacentalMassGrams",
    label: "Independently measured placental mass grams",
    kind: "number",
  },
  {
    id: "independentlyMatchedBirthMassGrams",
    label: "Independently matched birth mass grams",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredPlacentalMassGrams, "numerator");
  positive(input.independentlyMatchedBirthMassGrams, "denominator");
  return {
    observedRatio:
      (1 * input.independentlyMeasuredPlacentalMassGrams) /
      input.independentlyMatchedBirthMassGrams,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredPlacentalMassGrams: 2,
    independentlyMatchedBirthMassGrams: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/placental-weight-ratio",
  title: "Placental Weight Ratio Calculator",
  description:
    "Placental/birth-mass ratio with explicit same-unit independently matched specimens and placental trimming protocol. Independently measured compatible definitions/units required; ratio is not a diagnosis, efficacy measure or safety/clinical threshold.",
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
