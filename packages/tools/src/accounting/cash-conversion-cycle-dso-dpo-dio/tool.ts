import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CashConversionCycleInput = {
  readonly daysInventoryOutstanding: number;
  readonly daysPayableOutstanding: number;
  readonly daysSalesOutstanding: number;
};

export type CashConversionCycleOutput = {
  readonly cashConversionCycleDays: number;
};

export const cashConversionCycleExample = {
  input: {
    daysInventoryOutstanding: 60,
    daysPayableOutstanding: 40,
    daysSalesOutstanding: 30,
  },
  output: { cashConversionCycleDays: 50 },
} satisfies ToolExample<CashConversionCycleInput, CashConversionCycleOutput>;

export const calculateCashConversionCycle = (
  input: CashConversionCycleInput,
): CashConversionCycleOutput => {
  for (const [field, value] of Object.entries(input)) {
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        "The day count must be a finite non-negative number.",
        "invalid_days_value",
      );
  }
  const cashConversionCycleDays =
    input.daysInventoryOutstanding +
    input.daysSalesOutstanding -
    input.daysPayableOutstanding;
  if (!Number.isFinite(cashConversionCycleDays))
    simpleError(
      "daysSalesOutstanding",
      "The cash conversion cycle is outside the representable numeric range.",
      "result_not_finite",
    );
  return {
    cashConversionCycleDays:
      cashConversionCycleDays === 0 ? 0 : cashConversionCycleDays,
  };
};

export const cashConversionCycleTool = createSimpleTool({
  calculate: (input) =>
    calculateCashConversionCycle({
      daysInventoryOutstanding: input.daysInventoryOutstanding as number,
      daysPayableOutstanding: input.daysPayableOutstanding as number,
      daysSalesOutstanding: input.daysSalesOutstanding as number,
    }),
  description:
    "Calculate the cash conversion cycle in days as days inventory outstanding plus days sales outstanding minus days payable outstanding.",
  id: "accounting/cash-conversion-cycle-dso-dpo-dio",
  inputs: [
    {
      description:
        "Days sales outstanding: average receivable collection period in days.",
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
    {
      description:
        "Days payable outstanding: average time taken to pay suppliers, in days.",
      id: "daysPayableOutstanding",
      kind: "number",
      label: "Days payable outstanding",
      minimum: 0,
      unit: "days",
    },
  ],
  outputs: [
    {
      description:
        "Days between paying suppliers and collecting cash from customers; negative values mean suppliers finance the operating cycle.",
      id: "cashConversionCycleDays",
      kind: "number",
      label: "Cash conversion cycle",
      unit: "days",
    },
  ],
  title: "Cash Conversion Cycle Calculator",
});
export const runCashConversionCycle = cashConversionCycleTool.execute;
export default cashConversionCycleTool;
