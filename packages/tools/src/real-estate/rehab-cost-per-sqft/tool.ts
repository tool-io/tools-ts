import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RehabCostPerSqftInput = Readonly<{
  readonly rehabCost: number;
  readonly affectedSquareFeet: number;
}>;
export type RehabCostPerSqftOutput = Readonly<{
  readonly costPerSquareFoot: number;
}>;

export const calculateRehabCostPerSqft = (
  x: RehabCostPerSqftInput,
): RehabCostPerSqftOutput => {
  if (!Number.isFinite(x.rehabCost) || x.rehabCost < 0)
    simpleError("rehabCost", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.affectedSquareFeet) || x.affectedSquareFeet <= 0)
    simpleError("affectedSquareFeet", "Provide a finite positive number.");
  const costPerSquareFoot = x.rehabCost / x.affectedSquareFeet;
  if (!Number.isFinite(costPerSquareFoot))
    simpleError(
      "costPerSquareFoot",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    costPerSquareFoot: Object.is(costPerSquareFoot, -0) ? 0 : costPerSquareFoot,
  };
};

export const example = {
  input: {
    rehabCost: 40000,
    affectedSquareFeet: 2000,
  },
  output: { costPerSquareFoot: 20 },
} satisfies ToolExample<RehabCostPerSqftInput, RehabCostPerSqftOutput>;

export const tool = createSimpleTool({
  id: "real-estate/rehab-cost-per-sqft",
  title: "Rehab Cost Per Sqft",
  description:
    "Renovation budget per square foot of affected floor area, in the same currency as the budget.",
  inputs: [
    {
      id: "rehabCost",
      kind: "number",
      label: "Rehab Cost",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "affectedSquareFeet",
      kind: "number",
      label: "Affected Square Feet",
      unit: "ft2",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "costPerSquareFoot",
      kind: "number",
      label: "Cost Per Square Foot",
      unit: "currency/ft2",
    },
  ],
  calculate: (input) =>
    calculateRehabCostPerSqft({
      rehabCost: input.rehabCost as number,
      affectedSquareFeet: input.affectedSquareFeet as number,
    }),
});
export const rehabCostPerSqftTool = tool;
export const runRehabCostPerSqft = tool.execute;
export default tool;
