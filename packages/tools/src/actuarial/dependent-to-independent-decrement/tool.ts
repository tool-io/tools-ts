import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DependentToIndependentDecrementInput = {
  readonly causeIndex: number;
  readonly dependentDecrementRates: readonly number[];
};

export type DependentToIndependentDecrementOutput = {
  readonly independentDecrementRate: number;
};

export const dependentToIndependentDecrementExample = {
  input: {
    causeIndex: 1,
    dependentDecrementRates: [0.375, 0.375],
  },
  output: {
    independentDecrementRate: 0.5,
  },
} satisfies ToolExample<
  DependentToIndependentDecrementInput,
  DependentToIndependentDecrementOutput
>;

export const calculateDependentToIndependentDecrement = (
  input: DependentToIndependentDecrementInput,
): DependentToIndependentDecrementOutput => {
  const index = input.causeIndex - 1;
  if (
    !Number.isSafeInteger(input.causeIndex) ||
    index < 0 ||
    index >= input.dependentDecrementRates.length
  )
    simpleError(
      "causeIndex",
      "The cause index must point at an entry in the dependent decrement rates list.",
      "invalid_cause_index",
    );
  for (const rate of input.dependentDecrementRates)
    if (!(rate >= 0 && rate <= 1))
      simpleError(
        "dependentDecrementRates",
        "Each dependent rate must stay within the interval from zero to one.",
        "dependent_rate_out_of_range",
      );
  let totalDependent = 0;
  for (const rate of input.dependentDecrementRates) totalDependent += rate;
  if (!(totalDependent > 0 && totalDependent < 1))
    simpleError(
      "dependentDecrementRates",
      "The dependent rates must sum to a value strictly between zero and one.",
      "dependent_rate_sum_invalid",
    );
  const survival = 1 - totalDependent;
  const hazardShare = input.dependentDecrementRates[index] / totalDependent;
  return {
    independentDecrementRate: 1 - survival ** hazardShare,
  };
};

export const dependentToIndependentDecrementTool = createSimpleTool({
  calculate: (input) =>
    calculateDependentToIndependentDecrement({
      causeIndex: input.causeIndex as number,
      dependentDecrementRates:
        input.dependentDecrementRates as readonly number[],
    }),
  description:
    "Recover the single-cause independent annual decrement rate from its dependent multiple-decrement table rate assuming constant forces within the year.",
  id: "actuarial/dependent-to-independent-decrement",
  inputs: [
    {
      description:
        "One-based position of the cause within the dependent rates list.",
      id: "causeIndex",
      kind: "integer",
      label: "Cause index",
      minimum: 1,
    },
    {
      description:
        "Dependent annual decrement rates from the multiple-decrement table; they must sum below one.",
      id: "dependentDecrementRates",
      kind: "numberList",
      label: "Dependent decrement rates",
    },
  ],
  outputs: [
    {
      description:
        "Independent single-cause annual rate implied by the dependent table.",
      id: "independentDecrementRate",
      kind: "number",
      label: "Independent decrement rate",
    },
  ],
  title: "Dependent to Independent Decrement Converter",
});
export const runDependentToIndependentDecrement =
  dependentToIndependentDecrementTool.execute;
export default dependentToIndependentDecrementTool;
