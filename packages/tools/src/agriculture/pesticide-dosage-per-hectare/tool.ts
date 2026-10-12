import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyLegallyApprovedActiveIngredientKgPerHectare: number;
  readonly callerVerifiedProductActiveIngredientMassFraction: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerIndependentlyLegallyApprovedActiveIngredientKgPerHectare",
    label:
      "Caller independently legally approved active ingredient kg per hectare",
    kind: "number",
  },
  {
    id: "callerVerifiedProductActiveIngredientMassFraction",
    label: "Caller verified product active ingredient mass fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.callerIndependentlyLegallyApprovedActiveIngredientKgPerHectare,
    "callerIndependentlyLegallyApprovedActiveIngredientKgPerHectare",
  );
  fraction(
    input.callerVerifiedProductActiveIngredientMassFraction,
    "callerVerifiedProductActiveIngredientMassFraction",
  );
  positive(input.callerVerifiedProductActiveIngredientMassFraction, "fraction");
  return {
    value:
      input.callerIndependentlyLegallyApprovedActiveIngredientKgPerHectare /
      input.callerVerifiedProductActiveIngredientMassFraction,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyLegallyApprovedActiveIngredientKgPerHectare: 10,
    callerVerifiedProductActiveIngredientMassFraction: 0.5,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/pesticide-dosage-per-hectare",
  title: "Agriculture Pesticide Dosage Per Hectare Calculator",
  description:
    "Conditional independently LEGALLY approved activeingredientmasskg/ha divided by actual verified product mass fraction to productkg/ha; not carrierL/ha, select pesticide/product/target rate or authorization to apply.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
