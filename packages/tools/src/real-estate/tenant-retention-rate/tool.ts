import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TenantRetentionRateInput = Readonly<{
  readonly renewedLeases: number;
  readonly expiringLeases: number;
}>;
export type TenantRetentionRateOutput = Readonly<{
  readonly retentionPercent: number;
}>;

export const calculateTenantRetentionRate = (
  x: TenantRetentionRateInput,
): TenantRetentionRateOutput => {
  if (!Number.isFinite(x.renewedLeases) || x.renewedLeases < 0)
    simpleError("renewedLeases", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.expiringLeases) ||
    !Number.isSafeInteger(x.expiringLeases) ||
    x.expiringLeases < 1
  )
    simpleError("expiringLeases", "Provide a positive safe integer.");
  if (!(
    Number.isInteger(x.renewedLeases) && x.renewedLeases <= x.expiringLeases
  ))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const retentionPercent = (100 * x.renewedLeases) / x.expiringLeases;
  if (!Number.isFinite(retentionPercent))
    simpleError(
      "retentionPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    retentionPercent: Object.is(retentionPercent, -0) ? 0 : retentionPercent,
  };
};

export const example = {
  input: {
    renewedLeases: 80,
    expiringLeases: 100,
  },
  output: { retentionPercent: 80 },
} satisfies ToolExample<TenantRetentionRateInput, TenantRetentionRateOutput>;

export const tool = createSimpleTool({
  id: "real-estate/tenant-retention-rate",
  title: "Tenant Retention Rate",
  description:
    "Renewed leases as a percentage of leases that expired during the period.",
  inputs: [
    {
      id: "renewedLeases",
      kind: "number",
      label: "Renewed Leases",
      minimum: 0,
    },
    {
      id: "expiringLeases",
      kind: "integer",
      label: "Expiring Leases",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "retentionPercent",
      kind: "number",
      label: "Retention Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateTenantRetentionRate({
      renewedLeases: input.renewedLeases as number,
      expiringLeases: input.expiringLeases as number,
    }),
});
export const tenantRetentionRateTool = tool;
export const runTenantRetentionRate = tool.execute;
export default tool;
