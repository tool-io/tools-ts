import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ComparabilityAdjustmentInput = {
  readonly adjustments: ReadonlyArray<ReadonlyArray<number>>;
};

export type ComparabilityAdjustmentOutput = {
  readonly logComplete: boolean;
  readonly netAdjustment: number;
  readonly unsupportedAdjustmentIndices: ReadonlyArray<number>;
  readonly unsupportedAdjustmentTotal: number;
};

export const summarizeComparabilityAdjustments = (
  input: ComparabilityAdjustmentInput,
): ComparabilityAdjustmentOutput => {
  if (!Array.isArray(input.adjustments))
    simpleError(
      "adjustments",
      "Adjustments must be an array.",
      "adjustments_required",
    );
  const unsupportedAdjustmentIndices: number[] = [];
  let netAdjustment = 0;
  let unsupportedAdjustmentTotal = 0;
  for (const [index, row] of input.adjustments.entries()) {
    if (!Array.isArray(row) || row.length !== 3)
      simpleError(
        `adjustments.${index}`,
        "Each row must contain category code, signed amount, and evidence flag.",
        "invalid_adjustment_row",
      );
    const [categoryCode, amount, evidence] = row;
    if (
      !Number.isInteger(categoryCode) ||
      categoryCode! < 0 ||
      categoryCode! > 3
    )
      simpleError(
        `adjustments.${index}.0`,
        "Category codes must be 0 through 3.",
        "invalid_adjustment_category",
      );
    if (!Number.isFinite(amount))
      simpleError(
        `adjustments.${index}.1`,
        "Adjustment amounts must be finite.",
        "invalid_adjustment_amount",
      );
    if (evidence !== 0 && evidence !== 1)
      simpleError(
        `adjustments.${index}.2`,
        "Evidence flags must be 0 or 1.",
        "invalid_adjustment_evidence",
      );
    const nextNet = netAdjustment + amount!;
    if (!Number.isFinite(nextNet))
      simpleError(
        `adjustments.${index}.1`,
        "The net adjustment is not finite.",
        "result_not_finite",
      );
    netAdjustment = nextNet;
    if (evidence === 0) {
      unsupportedAdjustmentIndices.push(index);
      unsupportedAdjustmentTotal += Math.abs(amount!);
      if (!Number.isFinite(unsupportedAdjustmentTotal))
        simpleError(
          `adjustments.${index}.1`,
          "The unsupported total is not finite.",
          "result_not_finite",
        );
    }
  }
  return {
    logComplete: unsupportedAdjustmentIndices.length === 0,
    netAdjustment: netAdjustment === 0 ? 0 : netAdjustment,
    unsupportedAdjustmentIndices,
    unsupportedAdjustmentTotal,
  };
};

export const comparabilityAdjustmentExample = {
  input: {
    adjustments: [
      [0, 25_000, 1],
      [1, -10_000, 1],
      [2, 5_000, 0],
    ],
  },
  output: {
    logComplete: false,
    netAdjustment: 20_000,
    unsupportedAdjustmentIndices: [2],
    unsupportedAdjustmentTotal: 5_000,
  },
} satisfies ToolExample<
  ComparabilityAdjustmentInput,
  ComparabilityAdjustmentOutput
>;

export const comparabilityAdjustmentTool = createSimpleTool({
  calculate: (input) =>
    summarizeComparabilityAdjustments({
      adjustments: input.adjustments as number[][],
    }),
  description:
    "Net caller-coded comparability adjustments, retain their signs, and report unsupported rows lacking evidence and their absolute exposure.",
  id: "auditing/comparability-adjustment-like-quarter-same-store-log",
  inputs: [
    {
      description:
        "Rows ordered as category code 0 through 3, signed amount, and evidence-present flag.",
      id: "adjustments",
      kind: "matrix",
      label: "Comparability adjustments",
    },
  ],
  outputs: [
    { id: "logComplete", kind: "boolean", label: "Adjustment log supported" },
    { id: "netAdjustment", kind: "number", label: "Net adjustment" },
    {
      id: "unsupportedAdjustmentIndices",
      kind: "numberList",
      label: "Unsupported adjustment indices",
    },
    {
      id: "unsupportedAdjustmentTotal",
      kind: "number",
      label: "Unsupported absolute total",
      minimum: 0,
    },
  ],
  title: "Comparability Adjustment Like-for-Like Same-Store Log",
});

export const runComparabilityAdjustment = comparabilityAdjustmentTool.execute;
export default comparabilityAdjustmentTool;
