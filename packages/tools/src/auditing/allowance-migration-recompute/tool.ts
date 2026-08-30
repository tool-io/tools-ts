import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly exposures: readonly number[];
  readonly lossRatesPercent: readonly number[];
}>;
export type Output = Readonly<{
  readonly segmentAllowances: readonly number[];
  readonly totalAllowance: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.exposures.length === 0 ||
    input.exposures.length !== input.lossRatesPercent.length
  )
    simpleError(
      "exposures",
      "Exposure and loss-rate lists must be nonempty and equal length.",
      "length_mismatch",
    );
  if (
    input.exposures.some((v) => v < 0) ||
    input.lossRatesPercent.some((v) => v < 0)
  )
    simpleError(
      "exposures",
      "Exposures and rates must be nonnegative.",
      "negative_value",
    );
  const segmentAllowances = input.exposures.map(
    (value, index) => (value * input.lossRatesPercent[index]) / 100,
  );
  return {
    segmentAllowances,
    totalAllowance: segmentAllowances.reduce((a, b) => a + b, 0),
  };
};

export const exampleInput = {
  exposures: [100000, 50000],
  lossRatesPercent: [1, 4],
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  exposures: [0],
  lossRatesPercent: [5],
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      exposures: input.exposures as readonly number[],
      lossRatesPercent: input.lossRatesPercent as readonly number[],
    }),
  description:
    "Recompute segment and total allowance from caller-supplied exposures and loss rates.",
  id: "auditing/allowance-migration-recompute",
  inputs: [
    {
      id: "exposures",
      label: "Exposure balances",
      kind: "numberList",
      unit: "currency",
    },
    {
      id: "lossRatesPercent",
      label: "Loss rates",
      kind: "numberList",
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "segmentAllowances",
      label: "Segment allowances",
      kind: "numberList",
      unit: "currency",
    },
    {
      id: "totalAllowance",
      label: "Total allowance",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  title: "Allowance Migration Recompute",
});

export const run = tool.execute;
export default tool;
