import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OperatingCycleInput = {
  readonly daysSalesOutstanding: number;
  readonly daysInventoryOutstanding: number;
};

export type OperatingCycleOutput = {
  readonly operatingCycleDays: number;
};

export const operatingCycleExample = {
  input: { daysInventoryOutstanding: 60, daysSalesOutstanding: 30 },
  output: { operatingCycleDays: 90 },
} satisfies ToolExample<OperatingCycleInput, OperatingCycleOutput>;

export const calculateOperatingCycle = (
  input: OperatingCycleInput,
): OperatingCycleOutput => {
  for (const [field, value] of Object.entries(input)) {
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        "The day count must be a finite non-negative number.",
        "invalid_days_value",
      );
  }
  const operatingCycleDays =
    input.daysInventoryOutstanding + input.daysSalesOutstanding;
  if (!Number.isFinite(operatingCycleDays))
    simpleError(
      "daysSalesOutstanding",
      "The operating cycle is outside the representable numeric range.",
      "result_not_finite",
    );
  return {
    operatingCycleDays: operatingCycleDays === 0 ? 0 : operatingCycleDays,
  };
};

export const operatingCycleTool = createSimpleTool({
  calculate: (input) =>
    calculateOperatingCycle({
      daysInventoryOutstanding: input.daysInventoryOutstanding as number,
      daysSalesOutstanding: input.daysSalesOutstanding as number,
    }),
  description:
    "Calculate the operating cycle in days as days sales in inventory plus days sales outstanding, the time from acquiring inventory to collecting cash from sales.",
  id: "accounting/operating-cycle-inventory-plus-receivable-days",
  inputs: [
    {
      description:
        "Days sales outstanding: average collection period for receivables in days.",
      id: "daysSalesOutstanding",
      kind: "number",
      label: "Days sales outstanding",
      minimum: 0,
      unit: "days",
    },
    {
      description:
        "Days inventory outstanding: average time inventory is held before sale, in days.",
      id: "daysInventoryOutstanding",
      kind: "number",
      label: "Days inventory outstanding",
      minimum: 0,
      unit: "days",
    },
  ],
  outputs: [
    {
      description:
        "Operating cycle length in days; shorter cycles convert inventory to cash faster.",
      id: "operatingCycleDays",
      kind: "number",
      label: "Operating cycle",
      unit: "days",
    },
  ],
  title: "Operating Cycle Calculator",
});
export const runOperatingCycle = operatingCycleTool.execute;
export default operatingCycleTool;
