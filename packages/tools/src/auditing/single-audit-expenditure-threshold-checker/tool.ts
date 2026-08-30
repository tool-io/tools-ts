import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SingleAuditThresholdInput = {
  readonly auditThreshold: number;
  readonly totalFederalAwardsExpended: number;
};

export type SingleAuditThresholdOutput = {
  readonly amountAboveThreshold: number;
  readonly singleAuditThresholdMet: boolean;
};

export const checkSingleAuditExpenditureThreshold = (
  input: SingleAuditThresholdInput,
): SingleAuditThresholdOutput => {
  for (const [field, value] of [
    ["auditThreshold", input.auditThreshold],
    ["totalFederalAwardsExpended", input.totalFederalAwardsExpended],
  ] as const)
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        `${field} must be finite and nonnegative.`,
        "invalid_threshold_value",
      );
  return {
    amountAboveThreshold: Math.max(
      0,
      input.totalFederalAwardsExpended - input.auditThreshold,
    ),
    singleAuditThresholdMet:
      input.totalFederalAwardsExpended >= input.auditThreshold,
  };
};

export const singleAuditThresholdExample = {
  input: { auditThreshold: 1_000_000, totalFederalAwardsExpended: 1_250_000 },
  output: { amountAboveThreshold: 250_000, singleAuditThresholdMet: true },
} satisfies ToolExample<SingleAuditThresholdInput, SingleAuditThresholdOutput>;

export const singleAuditThresholdTool = createSimpleTool({
  calculate: (input) =>
    checkSingleAuditExpenditureThreshold({
      auditThreshold: input.auditThreshold as number,
      totalFederalAwardsExpended: input.totalFederalAwardsExpended as number,
    }),
  description:
    "Compare total federal awards expended with a caller-supplied Single Audit expenditure threshold. This is an applicability screen and does not determine Type A programs, major programs, or risk status.",
  id: "auditing/single-audit-expenditure-threshold-checker",
  inputs: [
    {
      id: "auditThreshold",
      kind: "number",
      label: "Applicable audit threshold",
      minimum: 0,
    },
    {
      id: "totalFederalAwardsExpended",
      kind: "number",
      label: "Total federal awards expended",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "amountAboveThreshold",
      kind: "number",
      label: "Amount above threshold",
      minimum: 0,
    },
    {
      id: "singleAuditThresholdMet",
      kind: "boolean",
      label: "Single Audit threshold met",
    },
  ],
  title: "Single Audit Expenditure Threshold Checker",
});

export const runSingleAuditThreshold = singleAuditThresholdTool.execute;
export default singleAuditThresholdTool;
