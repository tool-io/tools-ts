import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredBirthWeightGrams: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "independentlyMeasuredBirthWeightGrams",
    label: "Independently measured birth weight grams",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.independentlyMeasuredBirthWeightGrams, "weight");
  return {
    belowConventional2500Grams:
      input.independentlyMeasuredBirthWeightGrams < 2500,
    signed2500GramMargin: input.independentlyMeasuredBirthWeightGrams - 2500,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyMeasuredBirthWeightGrams: 2400 },
  output: {
    result: { belowConventional2500Grams: true, signed2500GramMargin: -100 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/low-birth-weight-checker",
  title: "Low Birth Weight Checker",
  description:
    "Exact strict-under2500gmeasured low-birthweight definition check. Not fetal estimated-weight diagnosis, gestational maturity, prognosis or claim above-threshold safety.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          belowConventional2500Grams: { type: "boolean" },
          signed2500GramMargin: { type: "number" },
        },
        required: ["belowConventional2500Grams", "signed2500GramMargin"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
