import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IndependentToDependentDecrementInput = {
  readonly causeIndex: number;
  readonly independentDecrementRates: readonly number[];
};

export type IndependentToDependentDecrementOutput = {
  readonly dependentDecrementRate: number;
};

export const independentToDependentDecrementExample = {
  input: {
    causeIndex: 1,
    independentDecrementRates: [0.5, 0.5],
  },
  output: {
    dependentDecrementRate: 0.375,
  },
} satisfies ToolExample<
  IndependentToDependentDecrementInput,
  IndependentToDependentDecrementOutput
>;

export const calculateIndependentToDependentDecrement = (
  input: IndependentToDependentDecrementInput,
): IndependentToDependentDecrementOutput => {
  const index = input.causeIndex - 1;
  if (
    !Number.isSafeInteger(input.causeIndex) ||
    index < 0 ||
    index >= input.independentDecrementRates.length
  )
    simpleError(
      "causeIndex",
      "The cause index must point at an entry in the independent decrement rates list.",
      "invalid_cause_index",
    );
  for (const rate of input.independentDecrementRates)
    if (!Number.isFinite(rate) || rate < 0 || rate >= 1)
      simpleError(
        "independentDecrementRates",
        "Each decrement rate must be finite and stay in the interval from zero inclusive to one exclusive.",
        "independent_rate_out_of_range",
      );
  let totalHazard = 0;
  for (const rate of input.independentDecrementRates)
    totalHazard += -Math.log(1 - rate);
  if (totalHazard === 0) return { dependentDecrementRate: 0 };
  const targetHazard = -Math.log(1 - input.independentDecrementRates[index]);
  return {
    dependentDecrementRate:
      (targetHazard / totalHazard) * -Math.expm1(-totalHazard),
  };
};

export const independentToDependentDecrementTool = createSimpleTool({
  calculate: (input) =>
    calculateIndependentToDependentDecrement({
      causeIndex: input.causeIndex as number,
      independentDecrementRates:
        input.independentDecrementRates as readonly number[],
    }),
  description:
    "Convert an independent annual decrement rate into its dependent multiple-decrement table rate assuming constant forces within the year.",
  id: "actuarial/independent-to-dependent-decrement",
  inputs: [
    {
      description:
        "One-based position of the cause within the independent rates list.",
      id: "causeIndex",
      kind: "integer",
      label: "Cause index",
      minimum: 1,
    },
    {
      description: "Independent annual decrement rates, one per cause.",
      id: "independentDecrementRates",
      kind: "numberList",
      label: "Independent decrement rates",
    },
  ],
  outputs: [
    {
      description:
        "Dependent rate for the selected cause in the multiple-decrement context.",
      id: "dependentDecrementRate",
      kind: "number",
      label: "Dependent decrement rate",
    },
  ],
  title: "Independent to Dependent Decrement Converter",
});
export const runIndependentToDependentDecrement =
  independentToDependentDecrementTool.execute;
export default independentToDependentDecrementTool;
