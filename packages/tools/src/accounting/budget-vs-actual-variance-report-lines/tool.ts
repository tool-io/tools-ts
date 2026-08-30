import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  aligned,
  binary,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly budgetLineMinor: readonly number[];
  readonly actualLineMinor: readonly number[];
  readonly revenueOneExpenseZeroFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedActualMinusBudgetMinor: readonly number[];
  readonly signedFavorableVariancesMinor: readonly number[];
  readonly variancePercentsOfAbsoluteBudget: readonly number[];
  readonly percentAvailableFlags: readonly number[];
}>;
const inputFields = [
  { id: "budgetLineMinor", label: "Budget line minor", kind: "numberList" },
  { id: "actualLineMinor", label: "Actual line minor", kind: "numberList" },
  {
    id: "revenueOneExpenseZeroFlags",
    label: "Revenue one expense zero flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.budgetLineMinor.forEach((v) => integer(v, "budgetLineMinor"));
  input.actualLineMinor.forEach((v) => integer(v, "actualLineMinor"));
  binary(input.revenueOneExpenseZeroFlags, "revenueOneExpenseZeroFlags");
  aligned(input.budgetLineMinor, input.actualLineMinor, "budgetLineMinor");
  aligned(
    input.budgetLineMinor,
    input.revenueOneExpenseZeroFlags,
    "budgetLineMinor",
  );
  const delta = input.actualLineMinor.map((v, i) =>
    integer(v - input.budgetLineMinor[i], "variance"),
  );
  return {
    signedActualMinusBudgetMinor: delta,
    signedFavorableVariancesMinor: delta.map(
      (v, i) => v * (input.revenueOneExpenseZeroFlags[i] ? 1 : -1),
    ),
    variancePercentsOfAbsoluteBudget: delta.map((v, i) =>
      input.budgetLineMinor[i] === 0
        ? 0
        : (100 * v) / Math.abs(input.budgetLineMinor[i]),
    ),
    percentAvailableFlags: input.budgetLineMinor.map((v) => (v === 0 ? 0 : 1)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  budgetLineMinor: [100, 100],
  actualLineMinor: [120, 80],
  revenueOneExpenseZeroFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  signedActualMinusBudgetMinor: [20, -20],
  signedFavorableVariancesMinor: [20, 20],
  variancePercentsOfAbsoluteBudget: [20, -20],
  percentAvailableFlags: [1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/budget-vs-actual-variance-report-lines",
  title: "Budget vs Actual Variance Report Lines Builder",
  description:
    "Build observed budget-versus-actual rows with explicit revenue/expense favorability and signed variance, using absolute budget percentage denominator; zero budget percent is sentinel zero with unavailable flag, not fabricated infinite growth.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedActualMinusBudgetMinor",
      label: "Signed actual minus budget minor",
      kind: "numberList",
    },
    {
      id: "signedFavorableVariancesMinor",
      label: "Signed favorable variances minor",
      kind: "numberList",
    },
    {
      id: "variancePercentsOfAbsoluteBudget",
      label: "Variance percents of absolute budget",
      kind: "numberList",
    },
    {
      id: "percentAvailableFlags",
      label: "Percent available flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      budgetLineMinor: value.budgetLineMinor as readonly number[],
      actualLineMinor: value.actualLineMinor as readonly number[],
      revenueOneExpenseZeroFlags:
        value.revenueOneExpenseZeroFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
