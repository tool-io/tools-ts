import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  money,
  weightedMean,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualComparableRawPricesMinorUnits: readonly number[];
  readonly callerIndependentAdjustmentTotalsMinorUnits: readonly number[];
  readonly callerApplicableComparableWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualComparableRawPricesMinorUnits",
    label: "Actual comparable raw prices minor units",
    kind: "numberList",
  },
  {
    id: "callerIndependentAdjustmentTotalsMinorUnits",
    label: "Caller independent adjustment totals minor units",
    kind: "numberList",
  },
  {
    id: "callerApplicableComparableWeights",
    label: "Caller applicable comparable weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualComparableRawPricesMinorUnits,
    input.callerIndependentAdjustmentTotalsMinorUnits,
    "comparables",
  );
  aligned(
    input.actualComparableRawPricesMinorUnits,
    input.callerApplicableComparableWeights,
    "weights",
  );
  input.actualComparableRawPricesMinorUnits.forEach((v) => money(v, "price"));
  input.callerIndependentAdjustmentTotalsMinorUnits.forEach((v) => {
    if (!Number.isSafeInteger(v))
      simpleError("adjustment", "Actualsignedsafeintegercurrencyadjustment.");
  });
  const a = input.actualComparableRawPricesMinorUnits.map((v, i) => {
    const x = v + input.callerIndependentAdjustmentTotalsMinorUnits[i];
    money(x, "adjustedprice");
    return x;
  });
  return {
    actualAdjustedComparablePricesMinorUnits: a,
    indicativeWeightedPriceMinorUnits: weightedMean(
      a,
      input.callerApplicableComparableWeights,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualComparableRawPricesMinorUnits: [100, 200],
    callerIndependentAdjustmentTotalsMinorUnits: [10, -20],
    callerApplicableComparableWeights: [1, 1],
  },
  output: {
    result: {
      actualAdjustedComparablePricesMinorUnits: [110, 180],
      indicativeWeightedPriceMinorUnits: 145,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "real-estate/cma",
  title: "Comparative Market Analysis Calculator",
  description:
    "Actual CMA price adjustment ledger and independent comparable weights, no livecomps, automatic adjustment/appraisal. Safe one-currency minor units and independently applicable comparability; weighted fractional minor units possible.",
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
