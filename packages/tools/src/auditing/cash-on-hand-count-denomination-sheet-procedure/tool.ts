import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CashDenominationInput = {
  readonly countedTotals: ReadonlyArray<number>;
  readonly denominationValues: ReadonlyArray<number>;
  readonly expectedTotal: number;
  readonly systemCounts: ReadonlyArray<number>;
  readonly tolerance: number;
};

export type CashDenominationOutput = {
  readonly countedTotal: number;
  readonly overallDifference: number;
  readonly perDenominationDifferences: ReadonlyArray<number>;
  readonly reconciled: boolean;
  readonly systemTotal: number;
};

export const reconcileCashDenominations = (
  input: CashDenominationInput,
): CashDenominationOutput => {
  if (
    !Array.isArray(input.denominationValues) ||
    !Array.isArray(input.systemCounts) ||
    !Array.isArray(input.countedTotals)
  )
    simpleError(
      "",
      "Denomination, system-count, and counted-total values must be arrays.",
      "cash_data_required",
    );
  if (
    input.denominationValues.length === 0 ||
    input.denominationValues.length !== input.systemCounts.length ||
    input.denominationValues.length !== input.countedTotals.length
  )
    simpleError(
      "countedTotals",
      "Each denomination must have one system count and one counted total.",
      "cash_data_length_mismatch",
    );
  if (!Number.isFinite(input.expectedTotal) || input.expectedTotal < 0)
    simpleError(
      "expectedTotal",
      "Expected total must be finite and nonnegative.",
      "invalid_expected_total",
    );
  if (!Number.isFinite(input.tolerance) || input.tolerance < 0)
    simpleError(
      "tolerance",
      "Tolerance must be finite and nonnegative.",
      "invalid_tolerance",
    );
  let systemTotal = 0;
  let countedTotal = 0;
  const perDenominationDifferences: number[] = [];
  for (const [index, denomination] of input.denominationValues.entries()) {
    const systemCount = input.systemCounts[index]!;
    const counted = input.countedTotals[index]!;
    for (const [field, value, positive] of [
      [`denominationValues.${index}`, denomination, true],
      [`systemCounts.${index}`, systemCount, false],
      [`countedTotals.${index}`, counted, false],
    ] as const)
      if (!Number.isFinite(value) || value < 0 || (positive && value === 0))
        simpleError(
          field,
          "Cash values must be finite and nonnegative; denominations must be positive.",
          "invalid_cash_value",
        );
    const systemValue = denomination * systemCount;
    const difference = counted - systemValue;
    if (!Number.isFinite(systemValue) || !Number.isFinite(difference))
      simpleError(
        `countedTotals.${index}`,
        "The denomination calculation is not finite.",
        "result_not_finite",
      );
    systemTotal += systemValue;
    countedTotal += counted;
    if (!Number.isFinite(systemTotal) || !Number.isFinite(countedTotal))
      simpleError(
        "countedTotals",
        "The cash total is outside the representable numeric range.",
        "result_not_finite",
      );
    perDenominationDifferences.push(difference);
  }
  const overallDifference = countedTotal - systemTotal;
  return {
    countedTotal,
    overallDifference,
    perDenominationDifferences,
    reconciled:
      Math.abs(overallDifference) <= input.tolerance &&
      Math.abs(countedTotal - input.expectedTotal) <= input.tolerance,
    systemTotal,
  };
};

export const cashDenominationExample = {
  input: {
    countedTotals: [500, 800, 2_000],
    denominationValues: [100, 50, 20],
    expectedTotal: 3_300,
    systemCounts: [5, 16, 100],
    tolerance: 0,
  },
  output: {
    countedTotal: 3_300,
    overallDifference: 0,
    perDenominationDifferences: [0, 0, 0],
    reconciled: true,
    systemTotal: 3_300,
  },
} satisfies ToolExample<CashDenominationInput, CashDenominationOutput>;

export const cashDenominationTool = createSimpleTool({
  calculate: (input) =>
    reconcileCashDenominations({
      countedTotals: input.countedTotals as number[],
      denominationValues: input.denominationValues as number[],
      expectedTotal: input.expectedTotal as number,
      systemCounts: input.systemCounts as number[],
      tolerance: input.tolerance as number,
    }),
  description:
    "Reconcile counted cash by denomination to system quantities and a ledger expected total, returning denomination-level and overall differences.",
  id: "auditing/cash-on-hand-count-denomination-sheet-procedure",
  inputs: [
    {
      description: "Counted value for each denomination.",
      id: "countedTotals",
      kind: "numberList",
      label: "Counted totals",
    },
    {
      description: "Positive value of each cash denomination.",
      id: "denominationValues",
      kind: "numberList",
      label: "Denomination values",
    },
    {
      description: "Cash balance expected by the accounting record.",
      id: "expectedTotal",
      kind: "number",
      label: "Expected total",
      minimum: 0,
    },
    {
      description: "System quantity for each denomination.",
      id: "systemCounts",
      kind: "numberList",
      label: "System counts",
    },
    { id: "tolerance", kind: "number", label: "Tolerance", minimum: 0 },
  ],
  outputs: [
    { id: "countedTotal", kind: "number", label: "Counted total", minimum: 0 },
    { id: "overallDifference", kind: "number", label: "Overall difference" },
    {
      id: "perDenominationDifferences",
      kind: "numberList",
      label: "Denomination differences",
    },
    { id: "reconciled", kind: "boolean", label: "Cash reconciled" },
    { id: "systemTotal", kind: "number", label: "System total", minimum: 0 },
  ],
  title: "Cash on Hand Count Denomination Sheet Procedure",
});

export const runCashDenomination = cashDenominationTool.execute;
export default cashDenominationTool;
