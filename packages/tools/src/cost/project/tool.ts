import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export type ProjectCost = {
  readonly contingencyCost: number;
  readonly currency: string;
  readonly laborCost: number;
  readonly materialsAndEquipment: number;
  readonly subtotal: number;
  readonly totalCost: number;
};
export const calculateProjectCost = (
  laborHours: number,
  laborRate: number,
  materials: number,
  equipment: number,
  contingencyPercent: number,
  currency: string,
): ProjectCost | null => {
  if (!currency.trim()) return null;
  const laborCost = laborHours * laborRate,
    materialsAndEquipment = materials + equipment,
    subtotal = laborCost + materialsAndEquipment,
    contingencyCost = (subtotal * contingencyPercent) / 100;
  return {
    contingencyCost,
    currency,
    laborCost,
    materialsAndEquipment,
    subtotal,
    totalCost: subtotal + contingencyCost,
  };
};
export const projectCostExample = {
  input: {
    contingencyPercent: 10,
    currency: "USD",
    equipment: 1_000,
    laborHours: 100,
    laborRate: 50,
    materials: 3_000,
  },
  output: {
    result: {
      contingencyCost: 900,
      currency: "USD",
      laborCost: 5_000,
      materialsAndEquipment: 4_000,
      subtotal: 9_000,
      totalCost: 9_900,
    },
  },
} satisfies ToolExample<
  {
    readonly contingencyPercent: number;
    readonly currency: string;
    readonly equipment: number;
    readonly laborHours: number;
    readonly laborRate: number;
    readonly materials: number;
  },
  { readonly result: ProjectCost }
>;
export const projectCostTool = createSimpleTool({
  id: "cost/project",
  title: "Project Cost Calculator",
  description:
    "Estimate labor, materials, equipment, contingency, and total project cost.",
  inputs: [
    { id: "currency", kind: "string", label: "Currency" },
    { id: "laborHours", kind: "number", label: "Labor hours", minimum: 0 },
    { id: "laborRate", kind: "number", label: "Hourly labor rate", minimum: 0 },
    { id: "materials", kind: "number", label: "Materials", minimum: 0 },
    { id: "equipment", kind: "number", label: "Equipment", minimum: 0 },
    {
      id: "contingencyPercent",
      kind: "number",
      label: "Contingency (%)",
      minimum: 0,
    },
  ],
  outputs: [
    {
      format: "cost/project",
      id: "result",
      kind: "object",
      label: "Project cost",
    },
  ],
  calculate: (input) => {
    const result = calculateProjectCost(
      input.laborHours as number,
      input.laborRate as number,
      input.materials as number,
      input.equipment as number,
      input.contingencyPercent as number,
      input.currency as string,
    );
    if (!result) return simpleError("currency", "Enter a nonempty currency.");
    return { result };
  },
});
export const runProjectCost = projectCostTool.execute;
export default projectCostTool;
