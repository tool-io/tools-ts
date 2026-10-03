import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly allowancePerArea: number;
  readonly eligibleCost: number;
};
export type Output = {
  readonly allowance: number;
  readonly reimbursable: number;
  readonly unused: number;
  readonly tenantCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    allowancePerArea: { type: "number", minimum: 0 },
    eligibleCost: { type: "number", minimum: 0 },
  },
  required: ["area", "allowancePerArea", "eligibleCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allowance: { type: "number" },
    reimbursable: { type: "number" },
    unused: { type: "number" },
    tenantCost: { type: "number" },
  },
  required: ["allowance", "reimbursable", "unused", "tenantCost"],
} as const;
/** Calculate tenant improvement allowance unused gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, allowancePerArea, eligibleCost } = request;
  const compute = (): Output => {
    H.domain(area >= 0 && allowancePerArea >= 0 && eligibleCost >= 0);
    return {
      allowance: area * allowancePerArea,
      reimbursable: Math.min(area * allowancePerArea, eligibleCost),
      unused: Math.max(0, area * allowancePerArea - eligibleCost),
      tenantCost: Math.max(0, eligibleCost - area * allowancePerArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { area: 100, allowancePerArea: 20, eligibleCost: 1500 },
  output: { allowance: 2000, reimbursable: 1500, unused: 500, tenantCost: 0 },
} satisfies ToolExample<Input, Output>;
export const tenantImprovementAllowanceUnusedGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "real-estate/tenant-improvement-allowance-unused-gap",
      title: "Tenant Improvement Allowance Unused Gap Tool",
      description:
        "Calculate tenant improvement allowance unused gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          area: { type: "number", minimum: 0 },
          allowancePerArea: { type: "number", minimum: 0 },
          eligibleCost: { type: "number", minimum: 0 },
        },
        required: ["area", "allowancePerArea", "eligibleCost"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          allowance: { type: "number" },
          reimbursable: { type: "number" },
          unused: { type: "number" },
          tenantCost: { type: "number" },
        },
        required: ["allowance", "reimbursable", "unused", "tenantCost"],
      },
      ports: {
        inputs: [
          {
            id: "area",
            label: "Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "allowancePerArea",
            label: "Allowance Per Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "eligibleCost",
            label: "Eligible Cost",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "allowance",
            label: "Allowance",
            valueType: { type: "number" },
          },
          {
            id: "reimbursable",
            label: "Reimbursable",
            valueType: { type: "number" },
          },
          { id: "unused", label: "Unused", valueType: { type: "number" } },
          {
            id: "tenantCost",
            label: "Tenant Cost",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = tenantImprovementAllowanceUnusedGapTool.execute;
export default tenantImprovementAllowanceUnusedGapTool;
