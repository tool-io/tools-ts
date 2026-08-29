import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DepletionUnitsInput = {
  readonly extractedUnits: number;
  readonly resourceCost: number;
  readonly salvageValue: number;
  readonly totalUnitsEstimate: number;
};

export type DepletionUnitsOutput = {
  readonly depletionExpense: number;
  readonly depletionRate: number;
};

export const depletionUnitsExample = {
  input: {
    extractedUnits: 4000,
    resourceCost: 1000000,
    salvageValue: 0,
    totalUnitsEstimate: 10000,
  },
  output: { depletionExpense: 400000, depletionRate: 100 },
} satisfies ToolExample<DepletionUnitsInput, DepletionUnitsOutput>;

export const calculateDepletionUnits = (
  input: DepletionUnitsInput,
): DepletionUnitsOutput => {
  if (!Number.isFinite(input.resourceCost) || input.resourceCost < 0)
    simpleError(
      "resourceCost",
      "The resource acquisition cost must be a finite non-negative number.",
      "invalid_resource_cost",
    );
  if (!Number.isFinite(input.salvageValue) || input.salvageValue < 0)
    simpleError(
      "salvageValue",
      "The salvage or residual land value must be a finite non-negative number.",
      "invalid_salvage",
    );
  if (input.salvageValue > input.resourceCost)
    simpleError(
      "salvageValue",
      "The salvage value must not exceed the resource cost.",
      "salvage_exceeds_cost",
    );
  if (
    !Number.isFinite(input.totalUnitsEstimate) ||
    input.totalUnitsEstimate <= 0
  )
    simpleError(
      "totalUnitsEstimate",
      "The estimated total recoverable units must be finite and greater than zero.",
      "positive_total_units_required",
    );
  if (!Number.isFinite(input.extractedUnits) || input.extractedUnits < 0)
    simpleError(
      "extractedUnits",
      "The units extracted in the period must be a finite non-negative number.",
      "invalid_extracted_units",
    );
  const depletionRate =
    (input.resourceCost - input.salvageValue) / input.totalUnitsEstimate;
  const depletionExpense = depletionRate * input.extractedUnits;
  if (!Number.isFinite(depletionExpense))
    simpleError(
      "extractedUnits",
      "Depletion expense is outside the finite numeric range.",
      "result_not_finite",
    );
  return {
    depletionRate: depletionRate === 0 ? 0 : depletionRate,
    depletionExpense: depletionExpense === 0 ? 0 : depletionExpense,
  };
};

export const depletionUnitsTool = createSimpleTool({
  calculate: (input) =>
    calculateDepletionUnits({
      extractedUnits: input.extractedUnits as number,
      resourceCost: input.resourceCost as number,
      salvageValue: input.salvageValue as number,
      totalUnitsEstimate: input.totalUnitsEstimate as number,
    }),
  description:
    "Compute depletion expense for a natural resource from units extracted using a per-unit rate of cost minus salvage value divided by estimated total units.",
  id: "accounting/depletion-units-natural-resource-extraction",
  inputs: [
    {
      description: "Acquisition and development cost of the natural resource.",
      id: "resourceCost",
      kind: "number",
      label: "Resource cost",
      minimum: 0,
    },
    {
      description:
        "Estimated residual value recoverable after extraction, such as land value.",
      id: "salvageValue",
      kind: "number",
      label: "Salvage value",
      minimum: 0,
    },
    {
      description:
        "Estimated total units recoverable over the resource life; must be greater than zero.",
      id: "totalUnitsEstimate",
      kind: "number",
      label: "Estimated total units",
    },
    {
      description: "Units extracted during the period.",
      id: "extractedUnits",
      kind: "number",
      label: "Units extracted",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Depletion cost assigned to each unit extracted.",
      id: "depletionRate",
      kind: "number",
      label: "Depletion rate per unit",
    },
    {
      description:
        "Depletion expense for the period, the per-unit rate times units extracted.",
      id: "depletionExpense",
      kind: "number",
      label: "Depletion expense",
    },
  ],
  title: "Depletion of Natural Resources Calculator",
});
export const runDepletionUnits = depletionUnitsTool.execute;
export default depletionUnitsTool;
