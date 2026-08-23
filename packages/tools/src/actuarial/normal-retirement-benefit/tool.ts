import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type NormalRetirementBenefitInput = {
  readonly annualAccrualRatePercent?: number;
  readonly finalAverageSalary: number;
  readonly yearsOfService: number;
};

export type NormalRetirementBenefitOutput = {
  readonly annualBenefit: number;
};

export const normalRetirementBenefitExample = {
  input: {
    annualAccrualRatePercent: 2,
    finalAverageSalary: 60000,
    yearsOfService: 30,
  },
  output: {
    annualBenefit: 36000,
  },
} satisfies ToolExample<
  NormalRetirementBenefitInput,
  NormalRetirementBenefitOutput
>;

export const calculateNormalRetirementBenefit = (
  input: NormalRetirementBenefitInput,
): NormalRetirementBenefitOutput => {
  return {
    annualBenefit: roundStatistic(
      input.finalAverageSalary *
        ((input.annualAccrualRatePercent ?? 1.5) / 100) *
        input.yearsOfService,
    ),
  };
};

export const normalRetirementBenefitTool = createSimpleTool({
  calculate: (input) =>
    calculateNormalRetirementBenefit(
      input as unknown as NormalRetirementBenefitInput,
    ),
  description:
    "Calculate the annual pension benefit from final average salary, an accrual rate per service year, and completed years of service.",
  id: "actuarial/normal-retirement-benefit",
  inputs: [
    {
      default: 1.5,
      description: "Pension credit earned per year of service.",
      id: "annualAccrualRatePercent",
      kind: "number",
      label: "Annual accrual rate",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      description: "Final average salary used by the plan formula.",
      id: "finalAverageSalary",
      kind: "number",
      label: "Final average salary",
      minimum: 0,
    },
    {
      description: "Completed years of credited service.",
      id: "yearsOfService",
      kind: "number",
      label: "Years of service",
      maximum: 1200,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Annual pension payable at normal retirement.",
      id: "annualBenefit",
      kind: "number",
      label: "Annual benefit",
    },
  ],
  title: "Normal Retirement Benefit Calculator",
});
export const runNormalRetirementBenefit = normalRetirementBenefitTool.execute;
export default normalRetirementBenefitTool;
