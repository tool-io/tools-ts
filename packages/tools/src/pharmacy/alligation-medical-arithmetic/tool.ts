import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  fraction,
  sum,
  aligned,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualIngredientMassesGrams: readonly number[];
  readonly callerVerifiedIngredientStrengthFractions: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIngredientMassesGrams",
    label: "Actual ingredient masses grams",
    kind: "numberList",
  },
  {
    id: "callerVerifiedIngredientStrengthFractions",
    label: "Caller verified ingredient strength fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualIngredientMassesGrams.length)
    simpleError("actualIngredientMassesGrams", "Actual nonempty observations.");
  input.actualIngredientMassesGrams.forEach((v) =>
    nonnegative(v, "actualIngredientMassesGrams"),
  );
  if (!input.callerVerifiedIngredientStrengthFractions.length)
    simpleError(
      "callerVerifiedIngredientStrengthFractions",
      "Actual nonempty observations.",
    );
  input.callerVerifiedIngredientStrengthFractions.forEach((v) =>
    fraction(v, "callerVerifiedIngredientStrengthFractions"),
  );
  aligned(
    input.actualIngredientMassesGrams,
    input.callerVerifiedIngredientStrengthFractions,
    "ingredients",
  );
  positive(sum(input.actualIngredientMassesGrams), "mass");
  return {
    value:
      sum(
        input.actualIngredientMassesGrams.map(
          (v, i) => v * input.callerVerifiedIngredientStrengthFractions[i],
        ),
      ) / sum(input.actualIngredientMassesGrams),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIngredientMassesGrams: [1, 1],
    callerVerifiedIngredientStrengthFractions: [0.2, 0.8],
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/alligation-medical-arithmetic",
  title: "Alligation Medical Arithmetic Tool",
  description:
    "Actual alligation medial same-basis mass weighted strength fraction \u03a3mC/\u03a3m, not determinephysicochemical compatibility, productpotency or preparation instructions. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
