import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PayrollTaxTieOutInput = {
  readonly payrollGross: number;
  readonly taxReturnGross: number;
  readonly tolerance: number;
};

export type PayrollTaxTieOutOutput = {
  readonly difference: number;
  readonly reconciled: boolean;
};

export const tieOutPayrollGrossToTaxReturn = (
  input: PayrollTaxTieOutInput,
): PayrollTaxTieOutOutput => {
  for (const [field, value] of [
    ["payrollGross", input.payrollGross],
    ["taxReturnGross", input.taxReturnGross],
  ] as const)
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        `${field} must be finite and nonnegative.`,
        "invalid_payroll_value",
      );
  if (!Number.isFinite(input.tolerance) || input.tolerance < 0)
    simpleError(
      "tolerance",
      "Tolerance must be finite and nonnegative.",
      "invalid_tolerance",
    );
  const difference = input.payrollGross - input.taxReturnGross;
  if (!Number.isFinite(difference))
    simpleError(
      "payrollGross",
      "The payroll tie-out difference is not finite.",
      "result_not_finite",
    );
  return {
    difference: difference === 0 ? 0 : difference,
    reconciled: Math.abs(difference) <= input.tolerance,
  };
};

export const payrollTaxTieOutExample = {
  input: { payrollGross: 2_500_000, taxReturnGross: 2_499_600, tolerance: 500 },
  output: { difference: 400, reconciled: true },
} satisfies ToolExample<PayrollTaxTieOutInput, PayrollTaxTieOutOutput>;

export const payrollTaxTieOutTool = createSimpleTool({
  calculate: (input) =>
    tieOutPayrollGrossToTaxReturn({
      payrollGross: input.payrollGross as number,
      taxReturnGross: input.taxReturnGross as number,
      tolerance: input.tolerance as number,
    }),
  description:
    "Tie gross payroll to the gross amount on a supplied tax return and report the exact signed difference against tolerance.",
  id: "auditing/payroll-agree-to-tax-return-gross-tie-out-procedure",
  inputs: [
    { id: "payrollGross", kind: "number", label: "Payroll gross", minimum: 0 },
    {
      id: "taxReturnGross",
      kind: "number",
      label: "Tax return gross",
      minimum: 0,
    },
    { id: "tolerance", kind: "number", label: "Tolerance", minimum: 0 },
  ],
  outputs: [
    { id: "difference", kind: "number", label: "Payroll minus tax return" },
    { id: "reconciled", kind: "boolean", label: "Gross amounts reconciled" },
  ],
  title: "Payroll Agree to Tax Return Gross Tie-Out Procedure",
});

export const runPayrollTaxTieOut = payrollTaxTieOutTool.execute;
export default payrollTaxTieOutTool;
