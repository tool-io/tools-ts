import { defineTool } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { integerSafeType, numberFiniteType } from "../../core/semantic-type.js";
import { isRecord, roundStatistic } from "../input.js";

export type BonferroniCorrectionInput = {
  readonly comparisons: number;
  readonly pValue: number;
};
export type BonferroniCorrectionOutput = {
  readonly adjustedPValue: number;
  readonly multiplier: number;
};
export const calculateBonferroniCorrection = (
  input: unknown,
): ToolResult<BonferroniCorrectionOutput> => {
  if (
    !isRecord(input) ||
    typeof input.pValue !== "number" ||
    input.pValue < 0 ||
    input.pValue > 1 ||
    typeof input.comparisons !== "number" ||
    !Number.isSafeInteger(input.comparisons) ||
    input.comparisons < 1
  )
    return invalidInput([
      {
        code: "valid_probability_and_count_required",
        field: "pValue",
        message:
          "pValue must be between zero and one and comparisons must be a positive integer.",
      },
    ]);
  return toolSuccess({
    adjustedPValue: roundStatistic(
      Math.min(1, input.pValue * input.comparisons),
    ),
    multiplier: input.comparisons,
  });
};
export const bonferroniCorrectionTool = defineTool<
  BonferroniCorrectionInput,
  BonferroniCorrectionOutput
>({
  contractVersion: 1,
  description:
    "Apply the Bonferroni multiplier to one p-value and cap the adjusted value at one.",
  execute: calculateBonferroniCorrection,
  executionKind: "pure",
  id: "statistics/bonferroni-correction",
  inputSchema: { type: "object" },
  isOutput: (value): value is BonferroniCorrectionOutput =>
    isRecord(value) &&
    typeof value.adjustedPValue === "number" &&
    Number.isFinite(value.adjustedPValue),
  outputSchema: { type: "object" },
  ports: {
    inputs: [
      {
        id: "pValue",
        label: "P-value",
        required: true,
        type: numberFiniteType,
        valueType: { format: "probability", type: "number" },
      },
      {
        id: "comparisons",
        label: "Comparisons",
        required: true,
        type: integerSafeType,
        valueType: { format: "count", type: "integer" },
      },
    ],
    outputs: [
      {
        id: "adjustedPValue",
        label: "Adjusted p-value",
        path: ["adjustedPValue"],
        type: numberFiniteType,
        valueType: { format: "probability", type: "number" },
      },
    ],
  },
  title: "Bonferroni Correction Calculator",
});
export default bonferroniCorrectionTool;
