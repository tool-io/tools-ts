import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DscrInput = {
  readonly annualNetOperatingIncomeUsd: number;
  readonly annualDebtServiceUsd: number;
};

export type DscrOutput = {
  readonly debtServiceCoverageRatio: number;
};

export const calculateDscr = (input: DscrInput): DscrOutput => {
  if (!(input.annualDebtServiceUsd > 0))
    return simpleError(
      "annualDebtServiceUsd",
      "Annual debt service must be greater than zero.",
      "invalid_debt_service",
    );
  return {
    debtServiceCoverageRatio:
      input.annualNetOperatingIncomeUsd / input.annualDebtServiceUsd,
  };
};

export const dscrExample = {
  input: { annualNetOperatingIncomeUsd: 123000, annualDebtServiceUsd: 95000 },
  output: { debtServiceCoverageRatio: 1.2947368421052632 },
} satisfies ToolExample<DscrInput, DscrOutput>;

export const dscrTool = createSimpleTool({
  id: "real-estate/dscr",
  title: "Debt Service Coverage Ratio Calculator",
  description:
    "Compute the debt service coverage ratio from annual net operating income and annual debt service.",
  inputs: [
    {
      description: "Annual net operating income in US dollars.",
      id: "annualNetOperatingIncomeUsd",
      kind: "number",
      label: "NOI",
    },
    {
      description:
        "Annual debt service (principal and interest) in US dollars.",
      id: "annualDebtServiceUsd",
      kind: "number",
      label: "Debt service",
    },
  ],
  outputs: [
    {
      description: "Debt service coverage ratio.",
      id: "debtServiceCoverageRatio",
      kind: "number",
      label: "DSCR",
    },
  ],
  calculate: (input) =>
    calculateDscr({
      annualDebtServiceUsd: input.annualDebtServiceUsd as number,
      annualNetOperatingIncomeUsd: input.annualNetOperatingIncomeUsd as number,
    }),
});

export const runDscr = dscrTool.execute;
export default dscrTool;
