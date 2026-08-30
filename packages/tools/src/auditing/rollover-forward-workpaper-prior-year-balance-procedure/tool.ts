import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RolloverWorkpaperInput = {
  readonly currentYearActivity: number;
  readonly currentYearEndingBalance: number;
  readonly currentYearOpeningBalance: number;
  readonly priorYearAdjustments: number;
  readonly priorYearEndingBalance: number;
  readonly tolerance: number;
};

export type RolloverWorkpaperOutput = {
  readonly endingDifference: number;
  readonly openingDifference: number;
  readonly reconciled: boolean;
};

export const reconcileRolloverWorkpaper = (
  input: RolloverWorkpaperInput,
): RolloverWorkpaperOutput => {
  for (const [field, value] of [
    ["currentYearActivity", input.currentYearActivity],
    ["currentYearEndingBalance", input.currentYearEndingBalance],
    ["currentYearOpeningBalance", input.currentYearOpeningBalance],
    ["priorYearAdjustments", input.priorYearAdjustments],
    ["priorYearEndingBalance", input.priorYearEndingBalance],
  ] as const)
    if (!Number.isFinite(value))
      simpleError(field, `${field} must be finite.`, "finite_value_required");
  if (!Number.isFinite(input.tolerance) || input.tolerance < 0)
    simpleError(
      "tolerance",
      "Tolerance must be finite and nonnegative.",
      "invalid_tolerance",
    );
  const expectedOpening =
    input.priorYearEndingBalance + input.priorYearAdjustments;
  const expectedEnding = expectedOpening + input.currentYearActivity;
  if (!Number.isFinite(expectedOpening) || !Number.isFinite(expectedEnding))
    simpleError(
      "priorYearEndingBalance",
      "The rollover result is not finite.",
      "result_not_finite",
    );
  const openingDifference = input.currentYearOpeningBalance - expectedOpening;
  const endingDifference = input.currentYearEndingBalance - expectedEnding;
  return {
    endingDifference: endingDifference === 0 ? 0 : endingDifference,
    openingDifference: openingDifference === 0 ? 0 : openingDifference,
    reconciled:
      Math.abs(openingDifference) <= input.tolerance &&
      Math.abs(endingDifference) <= input.tolerance,
  };
};

export const rolloverWorkpaperExample = {
  input: {
    currentYearActivity: -120_000,
    currentYearEndingBalance: 880_000,
    currentYearOpeningBalance: 1_000_000,
    priorYearAdjustments: 0,
    priorYearEndingBalance: 1_000_000,
    tolerance: 1_000,
  },
  output: { endingDifference: 0, openingDifference: 0, reconciled: true },
} satisfies ToolExample<RolloverWorkpaperInput, RolloverWorkpaperOutput>;

export const rolloverWorkpaperTool = createSimpleTool({
  calculate: (input) =>
    reconcileRolloverWorkpaper({
      currentYearActivity: input.currentYearActivity as number,
      currentYearEndingBalance: input.currentYearEndingBalance as number,
      currentYearOpeningBalance: input.currentYearOpeningBalance as number,
      priorYearAdjustments: input.priorYearAdjustments as number,
      priorYearEndingBalance: input.priorYearEndingBalance as number,
      tolerance: input.tolerance as number,
    }),
  description:
    "Reconcile prior-year ending balance, adjustments, current-year activity, opening balance, and ending balance in a rollover workpaper.",
  id: "auditing/rollover-forward-workpaper-prior-year-balance-procedure",
  inputs: [
    {
      id: "currentYearActivity",
      kind: "number",
      label: "Current-year activity",
    },
    {
      id: "currentYearEndingBalance",
      kind: "number",
      label: "Current-year ending balance",
    },
    {
      id: "currentYearOpeningBalance",
      kind: "number",
      label: "Current-year opening balance",
    },
    {
      id: "priorYearAdjustments",
      kind: "number",
      label: "Prior-year adjustments",
    },
    {
      id: "priorYearEndingBalance",
      kind: "number",
      label: "Prior-year ending balance",
    },
    { id: "tolerance", kind: "number", label: "Tolerance", minimum: 0 },
  ],
  outputs: [
    { id: "endingDifference", kind: "number", label: "Ending difference" },
    { id: "openingDifference", kind: "number", label: "Opening difference" },
    { id: "reconciled", kind: "boolean", label: "Rollover reconciled" },
  ],
  title: "Rollover Forward Workpaper Prior-Year Balance Procedure",
});

export const runRolloverWorkpaper = rolloverWorkpaperTool.execute;
export default rolloverWorkpaperTool;
