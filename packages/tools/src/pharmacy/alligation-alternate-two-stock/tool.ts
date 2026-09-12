import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  fraction,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedLowStockStrengthFraction: number;
  readonly callerVerifiedHighStockStrengthFraction: number;
  readonly callerSpecifiedFinalStrengthFraction: number;
  readonly callerSpecifiedFinalTotalMassGrams: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedLowStockStrengthFraction",
    label: "Caller verified low stock strength fraction",
    kind: "number",
  },
  {
    id: "callerVerifiedHighStockStrengthFraction",
    label: "Caller verified high stock strength fraction",
    kind: "number",
  },
  {
    id: "callerSpecifiedFinalStrengthFraction",
    label: "Caller specified final strength fraction",
    kind: "number",
  },
  {
    id: "callerSpecifiedFinalTotalMassGrams",
    label: "Caller specified final total mass grams",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.callerVerifiedLowStockStrengthFraction,
    input.callerVerifiedHighStockStrengthFraction,
    input.callerSpecifiedFinalStrengthFraction,
  ].forEach((v) => fraction(v, "strength"));
  positive(input.callerSpecifiedFinalTotalMassGrams, "mass");
  if (
    input.callerVerifiedHighStockStrengthFraction <=
      input.callerVerifiedLowStockStrengthFraction ||
    input.callerSpecifiedFinalStrengthFraction <
      input.callerVerifiedLowStockStrengthFraction ||
    input.callerSpecifiedFinalStrengthFraction >
      input.callerVerifiedHighStockStrengthFraction
  )
    simpleError("stocks", "Orderednonidenticalstocksandbracketedtarget.");
  const h =
    (input.callerSpecifiedFinalTotalMassGrams *
      (input.callerSpecifiedFinalStrengthFraction -
        input.callerVerifiedLowStockStrengthFraction)) /
    (input.callerVerifiedHighStockStrengthFraction -
      input.callerVerifiedLowStockStrengthFraction);
  return {
    conditionalLowStockMassGrams: input.callerSpecifiedFinalTotalMassGrams - h,
    conditionalHighStockMassGrams: h,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedLowStockStrengthFraction: 0.2,
    callerVerifiedHighStockStrengthFraction: 0.8,
    callerSpecifiedFinalStrengthFraction: 0.5,
    callerSpecifiedFinalTotalMassGrams: 10,
  },
  output: {
    result: {
      conditionalLowStockMassGrams: 5,
      conditionalHighStockMassGrams: 5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/alligation-alternate-two-stock",
  title: "Alligation Alternate Two Stock Calculator",
  description:
    "Alligation alternate ideal two-stock SAME mass-basis strength/mass target, not volumetric contraction, product compatibility, sterility or compounding authorization.",
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
