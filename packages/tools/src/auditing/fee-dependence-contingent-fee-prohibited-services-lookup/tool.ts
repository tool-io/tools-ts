import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FeeDependenceInput = {
  readonly contingentFee: boolean;
  readonly elevatedFeeThresholdPercent: number;
  readonly feePercentOfRevenue: number;
  readonly nonAuditServices: ReadonlyArray<string>;
  readonly outOfScopeServices: ReadonlyArray<string>;
};

export type FeeDependenceOutput = {
  readonly independenceRisk: "elevated" | "high" | "low";
  readonly riskFactors: ReadonlyArray<string>;
};

export const assessFeeDependenceRisk = (
  input: FeeDependenceInput,
): FeeDependenceOutput => {
  if (
    !Number.isFinite(input.feePercentOfRevenue) ||
    input.feePercentOfRevenue < 0
  )
    simpleError(
      "feePercentOfRevenue",
      "Fee percent must be finite and nonnegative.",
      "invalid_fee_percent",
    );
  if (
    !Number.isFinite(input.elevatedFeeThresholdPercent) ||
    input.elevatedFeeThresholdPercent < 0
  )
    simpleError(
      "elevatedFeeThresholdPercent",
      "Elevated-fee threshold must be finite and nonnegative.",
      "invalid_fee_threshold",
    );
  if (typeof input.contingentFee !== "boolean")
    simpleError(
      "contingentFee",
      "Contingent-fee status must be a boolean.",
      "boolean_field_required",
    );
  for (const [field, values] of [
    ["nonAuditServices", input.nonAuditServices],
    ["outOfScopeServices", input.outOfScopeServices],
  ] as const)
    if (!Array.isArray(values))
      simpleError(field, `${field} must be an array.`, "service_list_required");
  const riskFactors: string[] = [];
  if (input.feePercentOfRevenue >= input.elevatedFeeThresholdPercent)
    riskFactors.push("fee_dependence_threshold");
  if (input.contingentFee) riskFactors.push("contingent_fee");
  if (input.nonAuditServices.length > 0) riskFactors.push("non_audit_services");
  if (input.outOfScopeServices.length > 0)
    riskFactors.push("out_of_scope_service");
  return {
    independenceRisk:
      input.contingentFee || input.outOfScopeServices.length > 0
        ? "high"
        : riskFactors.length > 0
          ? "elevated"
          : "low",
    riskFactors,
  };
};

export const feeDependenceExample = {
  input: {
    contingentFee: false,
    elevatedFeeThresholdPercent: 15,
    feePercentOfRevenue: 20,
    nonAuditServices: ["Tax advisory"],
    outOfScopeServices: [],
  },
  output: {
    independenceRisk: "elevated",
    riskFactors: ["fee_dependence_threshold", "non_audit_services"],
  },
} satisfies ToolExample<FeeDependenceInput, FeeDependenceOutput>;

export const feeDependenceTool = createSimpleTool({
  calculate: (input) =>
    assessFeeDependenceRisk({
      contingentFee: input.contingentFee as boolean,
      elevatedFeeThresholdPercent: input.elevatedFeeThresholdPercent as number,
      feePercentOfRevenue: input.feePercentOfRevenue as number,
      nonAuditServices: input.nonAuditServices as string[],
      outOfScopeServices: input.outOfScopeServices as string[],
    }),
  description:
    "Screen caller-supplied fee dependence, contingent-fee, non-audit-service, and out-of-scope-service facts for independence risk without making a legal conclusion.",
  id: "auditing/fee-dependence-contingent-fee-prohibited-services-lookup",
  inputs: [
    { id: "contingentFee", kind: "boolean", label: "Contingent fee" },
    {
      description:
        "Fee-to-revenue percentage selected for elevated-risk review.",
      id: "elevatedFeeThresholdPercent",
      kind: "number",
      label: "Elevated fee threshold",
      minimum: 0,
      unit: "percent",
    },
    {
      id: "feePercentOfRevenue",
      kind: "number",
      label: "Fee percent of revenue",
      minimum: 0,
      unit: "percent",
    },
    {
      id: "nonAuditServices",
      kind: "stringList",
      label: "Non-audit services",
    },
    {
      id: "outOfScopeServices",
      kind: "stringList",
      label: "Out-of-scope services",
    },
  ],
  outputs: [
    {
      enum: ["elevated", "high", "low"],
      id: "independenceRisk",
      kind: "string",
      label: "Independence risk",
    },
    { id: "riskFactors", kind: "stringList", label: "Risk factors" },
  ],
  title: "Fee Dependence Contingent Fee Prohibited Services Lookup",
});

export const runFeeDependence = feeDependenceTool.execute;
export default feeDependenceTool;
