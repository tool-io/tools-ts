import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type ProjectedSalaryAccrualPresentValueInput = {
  readonly accrualRatePercent?: number;
  readonly currentSalary: number;
  readonly discountRatePercent: number;
  readonly salaryGrowthRatePercent?: number;
  readonly yearsToPayment: number;
};

export type ProjectedSalaryAccrualPresentValueOutput = {
  readonly presentValue: number;
};

export const projectedSalaryAccrualPresentValueExample = {
  input: {
    accrualRatePercent: 2,
    currentSalary: 200000,
    discountRatePercent: 100,
    salaryGrowthRatePercent: 0,
    yearsToPayment: 1,
  },
  output: { presentValue: 2000 },
} satisfies ToolExample<
  ProjectedSalaryAccrualPresentValueInput,
  ProjectedSalaryAccrualPresentValueOutput
>;

export const calculateProjectedSalaryAccrualPresentValue = (
  input: ProjectedSalaryAccrualPresentValueInput,
): ProjectedSalaryAccrualPresentValueOutput => {
  const growth = 1 + (input.salaryGrowthRatePercent ?? 0) / 100;
  const discount = 1 + input.discountRatePercent / 100;
  const projectedSalary = input.currentSalary * growth ** input.yearsToPayment;
  return {
    presentValue: roundStatistic(
      (projectedSalary * ((input.accrualRatePercent ?? 1.5) / 100)) /
        discount ** input.yearsToPayment,
    ),
  };
};

export const projectedSalaryAccrualPresentValueTool = createSimpleTool({
  calculate: (input) =>
    calculateProjectedSalaryAccrualPresentValue(
      input as unknown as ProjectedSalaryAccrualPresentValueInput,
    ),
  description:
    "Project a salary-based benefit accrual to its payment date and discount that single future amount to present value.",
  id: "actuarial/projected-salary-accrual-present-value",
  inputs: [
    {
      default: 1.5,
      description:
        "Share of projected salary represented by the benefit accrual.",
      id: "accrualRatePercent",
      kind: "number",
      label: "Accrual rate",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      description: "Salary at the valuation date.",
      id: "currentSalary",
      kind: "number",
      label: "Current salary",
      minimum: 0,
    },
    {
      description: "Annual rate used to discount the future accrual.",
      id: "discountRatePercent",
      kind: "number",
      label: "Discount rate",
      minimum: 0,
      unit: "%",
    },
    {
      default: 0,
      description: "Expected annual salary growth through the payment date.",
      id: "salaryGrowthRatePercent",
      kind: "number",
      label: "Salary growth rate",
      minimum: 0,
      unit: "%",
    },
    {
      description: "Whole years from valuation until the accrual is paid.",
      id: "yearsToPayment",
      kind: "integer",
      label: "Years to payment",
      maximum: 1200,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Present value of the single projected salary accrual.",
      id: "presentValue",
      kind: "number",
      label: "Present value",
    },
  ],
  title: "Projected Salary Accrual Present Value Calculator",
});
export const runProjectedSalaryAccrualPresentValue =
  projectedSalaryAccrualPresentValueTool.execute;
export default projectedSalaryAccrualPresentValueTool;
