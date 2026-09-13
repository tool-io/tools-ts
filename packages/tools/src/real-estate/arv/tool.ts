import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  aligned,
  money,
  weightedMean,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyAdjustedComparablePricesMinorUnits: readonly number[];
  readonly callerApplicableComparableWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyAdjustedComparablePricesMinorUnits",
    label: "Actual independently adjusted comparable prices minor units",
    kind: "numberList",
  },
  {
    id: "callerApplicableComparableWeights",
    label: "Caller applicable comparable weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualIndependentlyAdjustedComparablePricesMinorUnits.length)
    simpleError(
      "actualIndependentlyAdjustedComparablePricesMinorUnits",
      "Actual nonempty observations.",
    );
  input.actualIndependentlyAdjustedComparablePricesMinorUnits.forEach((v) =>
    nonnegative(v, "actualIndependentlyAdjustedComparablePricesMinorUnits"),
  );
  if (!input.callerApplicableComparableWeights.length)
    simpleError(
      "callerApplicableComparableWeights",
      "Actual nonempty observations.",
    );
  input.callerApplicableComparableWeights.forEach((v) =>
    nonnegative(v, "callerApplicableComparableWeights"),
  );
  input.actualIndependentlyAdjustedComparablePricesMinorUnits.forEach((v) =>
    money(v, "comparableprice"),
  );
  aligned(
    input.actualIndependentlyAdjustedComparablePricesMinorUnits,
    input.callerApplicableComparableWeights,
    "comparables",
  );
  return {
    value: weightedMean(
      input.actualIndependentlyAdjustedComparablePricesMinorUnits,
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
    actualIndependentlyAdjustedComparablePricesMinorUnits: [100, 300],
    callerApplicableComparableWeights: [1, 1],
  },
  output: { result: { value: 200 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "real-estate/arv",
  title: "After Repair Value Calculator",
  description:
    "Actual independently adjusted same-currency comparable-price weighted ARV indication, not appraisal or generate market adjustments. Ledger prices safe integers, weighted result may fractional minor unit, no asserted quote accuracy.",
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
