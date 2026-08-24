import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RobinHoodIndexPietraInput = {
  readonly incomes: readonly number[];
};

export type RobinHoodIndexPietraOutput = {
  readonly robinHoodIndex: number;
};

export const robinHoodIndexPietraExample = {
  input: {
    incomes: [1, 2, 3, 4, 10],
  },
  output: {
    robinHoodIndex: 0.3,
  },
} satisfies ToolExample<RobinHoodIndexPietraInput, RobinHoodIndexPietraOutput>;

export const calculateRobinHoodIndex = (
  input: RobinHoodIndexPietraInput,
): RobinHoodIndexPietraOutput => {
  const values = input.incomes;
  const count = values.length;
  if (
    count === 0 ||
    values.some((income) => !Number.isFinite(income) || income < 0)
  )
    simpleError(
      "incomes",
      "Supply at least one finite nonnegative income.",
      "invalid_value",
    );
  const mean = values.reduce((sum, value) => sum + value, 0) / count;
  if (!(mean > 0))
    simpleError(
      "incomes",
      "The mean income must be positive to form the Pietra index.",
      "invalid_value",
    );
  const absoluteDeviation = values.reduce(
    (sum, value) => sum + Math.abs(value - mean),
    0,
  );
  return {
    robinHoodIndex: absoluteDeviation / (2 * count * mean),
  };
};

export const robinHoodIndexPietraTool = createSimpleTool({
  calculate: (input) =>
    calculateRobinHoodIndex({
      incomes: input.incomes as readonly number[],
    }),
  description:
    "Compute the Robin Hood (Pietra) inequality index as the total absolute deviation of incomes from the mean divided by twice the aggregate income.",
  id: "sociology/robin-hood-index-pietra",
  inputs: [
    {
      description: "Income values in the distribution.",
      id: "incomes",
      kind: "numberList",
      label: "Incomes",
    },
  ],
  outputs: [
    {
      description:
        "Share of total income that would need to move to reach perfect equality.",
      id: "robinHoodIndex",
      kind: "number",
      label: "Robin Hood index",
    },
  ],
  title: "Robin Hood (Pietra) Index Calculator",
});
export const runRobinHoodIndexPietra = robinHoodIndexPietraTool.execute;
export default robinHoodIndexPietraTool;
