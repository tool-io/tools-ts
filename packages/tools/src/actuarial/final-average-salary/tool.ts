import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FinalAverageSalaryInput = {
  readonly averagingYears?: number;
  readonly salaryHistory: readonly number[];
};

export type FinalAverageSalaryOutput = {
  readonly finalAverageSalary: number;
};

export const finalAverageSalaryExample = {
  input: {
    averagingYears: 3,
    salaryHistory: [40000, 42000, 45000, 48000],
  },
  output: { finalAverageSalary: 45000 },
} satisfies ToolExample<FinalAverageSalaryInput, FinalAverageSalaryOutput>;

export const calculateFinalAverageSalary = (
  input: FinalAverageSalaryInput,
): FinalAverageSalaryOutput => {
  const averagingYears = input.averagingYears ?? 3;
  if (
    !Number.isSafeInteger(averagingYears) ||
    averagingYears < 1 ||
    averagingYears > input.salaryHistory.length
  )
    simpleError(
      "averagingYears",
      "The averaging window must be at least one year and no longer than the salary history.",
      "averaging_window_invalid",
    );
  if (
    input.salaryHistory.some((salary) => !Number.isFinite(salary) || salary < 0)
  )
    simpleError(
      "salaryHistory",
      "Salary history must contain only finite, nonnegative amounts.",
      "salary_history_invalid",
    );
  const total = input.salaryHistory
    .slice(-averagingYears)
    .reduce((sum, salary) => sum + salary, 0);
  if (!Number.isFinite(total))
    simpleError(
      "salaryHistory",
      "The salary total is outside the finite numeric range.",
      "result_not_finite",
    );
  return { finalAverageSalary: total / averagingYears };
};

export const finalAverageSalaryTool = createSimpleTool({
  calculate: (input) =>
    calculateFinalAverageSalary({
      averagingYears: input.averagingYears as number,
      salaryHistory: input.salaryHistory as readonly number[],
    }),
  description:
    "Average the most recent years in a salary history to obtain the final average salary used as an input to defined-benefit pension formulas.",
  id: "actuarial/final-average-salary",
  inputs: [
    {
      default: 3,
      description: "Number of most recent salary years to average.",
      id: "averagingYears",
      kind: "integer",
      label: "Averaging years",
      minimum: 1,
    },
    {
      description: "Finite, nonnegative annual salaries ordered oldest first.",
      id: "salaryHistory",
      kind: "numberList",
      label: "Salary history",
    },
  ],
  outputs: [
    {
      description: "Arithmetic mean over the final salary window.",
      id: "finalAverageSalary",
      kind: "number",
      label: "Final average salary",
    },
  ],
  title: "Final Average Salary Calculator",
});
export const runFinalAverageSalary = finalAverageSalaryTool.execute;
export default finalAverageSalaryTool;
