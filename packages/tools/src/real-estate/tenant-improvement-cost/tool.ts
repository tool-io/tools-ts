import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TenantImprovementCostInput = Readonly<{
  readonly costPerSquareFoot: number;
  readonly treatedSquareFeet: number;
}>;
export type TenantImprovementCostOutput = Readonly<{
  readonly totalCost: number;
}>;

export const calculateTenantImprovementCost = (
  x: TenantImprovementCostInput,
): TenantImprovementCostOutput => {
  if (!Number.isFinite(x.costPerSquareFoot) || x.costPerSquareFoot < 0)
    simpleError("costPerSquareFoot", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.treatedSquareFeet) || x.treatedSquareFeet < 0)
    simpleError("treatedSquareFeet", "Provide a finite nonnegative number.");
  const totalCost = x.costPerSquareFoot * x.treatedSquareFeet;
  if (!Number.isFinite(totalCost))
    simpleError(
      "totalCost",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { totalCost: Object.is(totalCost, -0) ? 0 : totalCost };
};

export const example = {
  input: {
    costPerSquareFoot: 20,
    treatedSquareFeet: 1000,
  },
  output: { totalCost: 20000 },
} satisfies ToolExample<
  TenantImprovementCostInput,
  TenantImprovementCostOutput
>;

export const tool = createSimpleTool({
  id: "real-estate/tenant-improvement-cost",
  title: "Tenant Improvement Cost",
  description:
    "Total tenant-improvement allowance from a cost per square foot and treated area.",
  inputs: [
    {
      id: "costPerSquareFoot",
      kind: "number",
      label: "Cost Per Square Foot",
      unit: "currency/ft2",
      minimum: 0,
    },
    {
      id: "treatedSquareFeet",
      kind: "number",
      label: "Treated Square Feet",
      unit: "ft2",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "totalCost", kind: "number", label: "Total Cost", unit: "currency" },
  ],
  calculate: (input) =>
    calculateTenantImprovementCost({
      costPerSquareFoot: input.costPerSquareFoot as number,
      treatedSquareFeet: input.treatedSquareFeet as number,
    }),
});
export const tenantImprovementCostTool = tool;
export const runTenantImprovementCost = tool.execute;
export default tool;
