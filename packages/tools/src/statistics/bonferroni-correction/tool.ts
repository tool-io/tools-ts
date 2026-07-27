import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { isRecord, roundStatistic } from "../input.js";

export type BonferroniCorrectionInput = {
  readonly comparisons: number;
  readonly pValue: number;
};
export type BonferroniCorrectionOutput = {
  readonly adjustedPValue: number;
  readonly multiplier: number;
};

export const bonferroniCorrectionExample = {
  input: { comparisons: 5, pValue: 0.01 },
} satisfies ToolExample<BonferroniCorrectionInput>;

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
  execution: { kind: "pure" },
  id: "statistics/bonferroni-correction",
  inputSchema: {
    additionalProperties: false,
    properties: {
      comparisons: { minimum: 1, type: "integer" },
      pValue: { maximum: 1, minimum: 0, type: "number" },
    },
    required: ["pValue", "comparisons"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      adjustedPValue: { maximum: 1, minimum: 0, type: "number" },
      multiplier: { minimum: 1, type: "integer" },
    },
    required: ["adjustedPValue", "multiplier"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "pValue",
        label: "P-value",
        required: true,
        valueType: { format: "probability", type: "number" },
      },
      {
        id: "comparisons",
        label: "Comparisons",
        required: true,
        valueType: { format: "count", type: "integer" },
      },
    ],
    outputs: [
      {
        id: "adjustedPValue",
        label: "Adjusted p-value",
        path: ["adjustedPValue"],
        valueType: { format: "probability", type: "number" },
      },
    ],
  },
  title: "Bonferroni Correction Calculator",
});
export default bonferroniCorrectionTool;
