import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly benefitValue: number;
  readonly exclusionCap: number;
  readonly employeePayment: number;
}>;
export type Output = Readonly<{
  readonly netBenefitValue: number;
  readonly excludedAmount: number;
  readonly taxableBenefit: number;
}>;

export const calculate = (input: Input): Output => {
  const netBenefitValue = Math.max(
    0,
    input.benefitValue - input.employeePayment,
  );
  const excludedAmount = Math.min(netBenefitValue, input.exclusionCap);
  return {
    netBenefitValue,
    excludedAmount,
    taxableBenefit: netBenefitValue - excludedAmount,
  };
};

export const exampleInput = {
  benefitValue: 1000,
  exclusionCap: 600,
  employeePayment: 100,
} satisfies Input;
export const exampleOutput = {
  netBenefitValue: 900,
  excludedAmount: 600,
  taxableBenefit: 300,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      benefitValue: input.benefitValue as number,
      exclusionCap: input.exclusionCap as number,
      employeePayment: input.employeePayment as number,
    }),
  description:
    "Split a fringe benefit into excluded and taxable amounts using supplied values.",
  id: "taxation/fringe-benefit-exclusion",
  inputs: [
    {
      id: "benefitValue",
      label: "Fringe-benefit value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "exclusionCap",
      label: "Caller exclusion cap",
      kind: "number",
      minimum: 0,
    },
    {
      id: "employeePayment",
      label: "Employee payment",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "netBenefitValue",
      label: "Benefit after employee payment",
      kind: "number",
      minimum: 0,
    },
    {
      id: "excludedAmount",
      label: "Excluded amount",
      kind: "number",
      minimum: 0,
    },
    {
      id: "taxableBenefit",
      label: "Taxable benefit",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Fringe-Benefit Exclusion",
});

export const run = tool.execute;
export default tool;
