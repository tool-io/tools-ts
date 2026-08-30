import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CommonSizeAnalysisInput = {
  readonly currentAmounts: ReadonlyArray<number>;
  readonly priorAmounts: ReadonlyArray<number>;
  readonly thresholdPercentagePoints: number;
};

export type CommonSizeAnalysisOutput = {
  readonly changePercentagePoints: ReadonlyArray<number>;
  readonly currentPercents: ReadonlyArray<number>;
  readonly flaggedIndices: ReadonlyArray<number>;
  readonly priorPercents: ReadonlyArray<number>;
};

export const analyzeCommonSizeChanges = (
  input: CommonSizeAnalysisInput,
): CommonSizeAnalysisOutput => {
  if (
    !Array.isArray(input.currentAmounts) ||
    !Array.isArray(input.priorAmounts)
  )
    simpleError(
      "",
      "Current and prior amounts must be arrays.",
      "amount_data_required",
    );
  if (
    input.currentAmounts.length === 0 ||
    input.currentAmounts.length !== input.priorAmounts.length
  )
    simpleError(
      "priorAmounts",
      "Each current line item must have one prior-period amount.",
      "amount_data_length_mismatch",
    );
  if (
    !Number.isFinite(input.thresholdPercentagePoints) ||
    input.thresholdPercentagePoints < 0
  )
    simpleError(
      "thresholdPercentagePoints",
      "Threshold must be finite and nonnegative.",
      "invalid_threshold",
    );
  const currentTotal = input.currentAmounts.reduce(
    (sum, value) => sum + value,
    0,
  );
  const priorTotal = input.priorAmounts.reduce((sum, value) => sum + value, 0);
  for (const [field, value, index] of [
    ...input.currentAmounts.map(
      (value, index) => [`currentAmounts.${index}`, value, index] as const,
    ),
    ...input.priorAmounts.map(
      (value, index) => [`priorAmounts.${index}`, value, index] as const,
    ),
  ])
    if (!Number.isFinite(value))
      simpleError(field, "Amounts must be finite.", "invalid_amount");
  if (currentTotal === 0 || priorTotal === 0)
    simpleError(
      "",
      "Current and prior totals must be nonzero.",
      "zero_common_size_total",
    );
  if (!Number.isFinite(currentTotal) || !Number.isFinite(priorTotal))
    simpleError("", "Common-size totals are not finite.", "result_not_finite");
  const currentPercents: number[] = [];
  const priorPercents: number[] = [];
  const changePercentagePoints: number[] = [];
  const flaggedIndices: number[] = [];
  for (const [index] of input.currentAmounts.entries()) {
    const currentPercent = (input.currentAmounts[index]! / currentTotal) * 100;
    const priorPercent = (input.priorAmounts[index]! / priorTotal) * 100;
    const change = currentPercent - priorPercent;
    if (!Number.isFinite(change))
      simpleError(
        `currentAmounts.${index}`,
        "Common-size change is not finite.",
        "result_not_finite",
      );
    currentPercents.push(currentPercent);
    priorPercents.push(priorPercent);
    changePercentagePoints.push(change);
    if (Math.abs(change) >= input.thresholdPercentagePoints)
      flaggedIndices.push(index);
  }
  return {
    changePercentagePoints,
    currentPercents,
    flaggedIndices,
    priorPercents,
  };
};

export const commonSizeAnalysisExample = {
  input: {
    currentAmounts: [600, 300, 100],
    priorAmounts: [500, 350, 150],
    thresholdPercentagePoints: 5,
  },
  output: {
    changePercentagePoints: [10, -5, -5],
    currentPercents: [60, 30, 10],
    flaggedIndices: [0, 1, 2],
    priorPercents: [50, 35, 15],
  },
} satisfies ToolExample<CommonSizeAnalysisInput, CommonSizeAnalysisOutput>;

export const commonSizeAnalysisTool = createSimpleTool({
  calculate: (input) =>
    analyzeCommonSizeChanges({
      currentAmounts: input.currentAmounts as number[],
      priorAmounts: input.priorAmounts as number[],
      thresholdPercentagePoints: input.thresholdPercentagePoints as number,
    }),
  description:
    "Convert paired current and prior line-item amounts to common-size percentages and flag absolute percentage-point changes at a selected threshold.",
  id: "auditing/ratio-analysis-common-size-fluctuation-prompt-list",
  inputs: [
    {
      description: "Current-period line-item amounts.",
      id: "currentAmounts",
      kind: "numberList",
      label: "Current amounts",
    },
    {
      description: "Prior-period line-item amounts in the same order.",
      id: "priorAmounts",
      kind: "numberList",
      label: "Prior amounts",
    },
    {
      description:
        "Absolute common-size change threshold in percentage points.",
      id: "thresholdPercentagePoints",
      kind: "number",
      label: "Change threshold",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "changePercentagePoints",
      kind: "numberList",
      label: "Changes in percentage points",
    },
    {
      id: "currentPercents",
      kind: "numberList",
      label: "Current common-size percentages",
    },
    { id: "flaggedIndices", kind: "numberList", label: "Flagged line indices" },
    {
      id: "priorPercents",
      kind: "numberList",
      label: "Prior common-size percentages",
    },
  ],
  title: "Ratio Analysis Common-Size Fluctuation Prompt List",
});

export const runCommonSizeAnalysis = commonSizeAnalysisTool.execute;
export default commonSizeAnalysisTool;
