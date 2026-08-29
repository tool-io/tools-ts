import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UnitsOfProductionRateInput = {
  readonly cost: number;
  readonly salvageValue: number;
  readonly totalUnits: number;
};

export type UnitsOfProductionRateOutput = {
  readonly depreciableBase: number;
  readonly ratePerUnit: number;
};

export const unitsOfProductionRateExample = {
  input: { cost: 50000, salvageValue: 2000, totalUnits: 960000 },
  output: { depreciableBase: 48000, ratePerUnit: 0.05 },
} satisfies ToolExample<
  UnitsOfProductionRateInput,
  UnitsOfProductionRateOutput
>;

export const calculateUnitsOfProductionRate = (
  input: UnitsOfProductionRateInput,
): UnitsOfProductionRateOutput => {
  if (!Number.isFinite(input.cost) || input.cost < 0)
    simpleError(
      "cost",
      "The asset cost must be a finite non-negative number.",
      "invalid_cost",
    );
  if (!Number.isFinite(input.salvageValue) || input.salvageValue < 0)
    simpleError(
      "salvageValue",
      "The salvage value must be a finite non-negative number.",
      "invalid_salvage",
    );
  if (input.salvageValue > input.cost)
    simpleError(
      "salvageValue",
      "The salvage value must not exceed the asset cost.",
      "salvage_exceeds_cost",
    );
  if (!Number.isFinite(input.totalUnits) || input.totalUnits <= 0)
    simpleError(
      "totalUnits",
      "The estimated total units must be finite and greater than zero.",
      "positive_total_units_required",
    );
  const depreciableBase = input.cost - input.salvageValue;
  const ratePerUnit = depreciableBase / input.totalUnits;
  if (!Number.isFinite(ratePerUnit))
    simpleError(
      "totalUnits",
      "Depreciation per unit exceeds the finite numeric range.",
      "result_not_finite",
    );
  return { depreciableBase, ratePerUnit };
};

export const unitsOfProductionRateTool = createSimpleTool({
  calculate: (input) =>
    calculateUnitsOfProductionRate({
      cost: input.cost as number,
      salvageValue: input.salvageValue as number,
      totalUnits: input.totalUnits as number,
    }),
  description:
    "Compute the units-of-production depreciation rate per unit as cost minus salvage value divided by estimated total units of output.",
  id: "accounting/units-of-production-depreciation-rate",
  inputs: [
    {
      description: "Capitalized cost of the asset.",
      id: "cost",
      kind: "number",
      label: "Cost",
      minimum: 0,
    },
    {
      description:
        "Expected salvage value at the end of the asset's useful life.",
      id: "salvageValue",
      kind: "number",
      label: "Salvage value",
      minimum: 0,
    },
    {
      description:
        "Estimated total units the asset will produce, drive, or print over its life; must be greater than zero.",
      id: "totalUnits",
      kind: "number",
      label: "Estimated total units",
    },
  ],
  outputs: [
    {
      description:
        "Depreciable base, the cost less salvage value to be allocated over total units.",
      id: "depreciableBase",
      kind: "number",
      label: "Depreciable base",
    },
    {
      description:
        "Depreciation assigned to each unit of output in cost-per-unit terms.",
      id: "ratePerUnit",
      kind: "number",
      label: "Rate per unit",
    },
  ],
  title: "Units-of-Production Depreciation Rate Calculator",
});
export const runUnitsOfProductionRate = unitsOfProductionRateTool.execute;
export default unitsOfProductionRateTool;
