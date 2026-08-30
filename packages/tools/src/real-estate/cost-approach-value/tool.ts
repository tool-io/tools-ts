import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CostApproachValueInput = Readonly<{
  readonly landValue: number;
  readonly replacementCost: number;
  readonly accruedDepreciation: number;
}>;
export type CostApproachValueOutput = Readonly<{
  readonly indicatedValue: number;
}>;

export const calculateCostApproachValue = (
  x: CostApproachValueInput,
): CostApproachValueOutput => {
  if (!Number.isFinite(x.landValue) || x.landValue < 0)
    simpleError("landValue", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.replacementCost) || x.replacementCost < 0)
    simpleError("replacementCost", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.accruedDepreciation) || x.accruedDepreciation < 0)
    simpleError("accruedDepreciation", "Provide a finite nonnegative number.");
  if (!(x.accruedDepreciation <= x.replacementCost))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const indicatedValue =
    x.landValue + x.replacementCost - x.accruedDepreciation;
  if (!Number.isFinite(indicatedValue))
    simpleError(
      "indicatedValue",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { indicatedValue: Object.is(indicatedValue, -0) ? 0 : indicatedValue };
};

export const example = {
  input: {
    landValue: 50000,
    replacementCost: 200000,
    accruedDepreciation: 20000,
  },
  output: { indicatedValue: 230000 },
} satisfies ToolExample<CostApproachValueInput, CostApproachValueOutput>;

export const tool = createSimpleTool({
  id: "real-estate/cost-approach-value",
  title: "Cost Approach Value",
  description:
    "Simplified cost-approach indication: land value plus replacement cost of improvements less accrued depreciation.",
  inputs: [
    {
      id: "landValue",
      kind: "number",
      label: "Land Value",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "replacementCost",
      kind: "number",
      label: "Replacement Cost",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "accruedDepreciation",
      kind: "number",
      label: "Accrued Depreciation",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "indicatedValue",
      kind: "number",
      label: "Indicated Value",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateCostApproachValue({
      landValue: input.landValue as number,
      replacementCost: input.replacementCost as number,
      accruedDepreciation: input.accruedDepreciation as number,
    }),
});
export const costApproachValueTool = tool;
export const runCostApproachValue = tool.execute;
export default tool;
