import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
export type ZScoreInput = {
  readonly mean: number;
  readonly standardDeviation: number;
  readonly value: number;
};
export type ZScoreOutput = { readonly zScore: number };
export const zScoreExample = {
  input: { mean: 10, standardDeviation: 2.5, value: 15 },
} satisfies ToolExample<ZScoreInput>;
export const calculateZScore = (input: unknown): ToolResult<ZScoreOutput> => {
  if (typeof input !== "object" || input === null || Array.isArray(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const { mean, standardDeviation, value } = input as Record<string, unknown>;
  if (
    ![mean, value].every(
      (entry) => typeof entry === "number" && Number.isFinite(entry),
    ) ||
    typeof standardDeviation !== "number" ||
    !Number.isFinite(standardDeviation) ||
    standardDeviation <= 0
  )
    return invalidInput([
      {
        code: "valid_z_score_input_required",
        field: "standardDeviation",
        message:
          "Value and mean must be finite and standard deviation must be positive.",
      },
    ]);
  return toolSuccess({
    zScore: ((value as number) - (mean as number)) / standardDeviation,
  });
};
export const zScoreTool = defineTool<ZScoreInput, ZScoreOutput>({
  contractVersion: 1,
  description:
    "Calculate how many standard deviations a value lies from a mean.",
  execute: calculateZScore,
  execution: { kind: "pure" },
  id: "statistics/z-score",
  inputSchema: {
    additionalProperties: false,
    properties: {
      mean: { type: "number" },
      standardDeviation: { exclusiveMinimum: 0, type: "number" },
      value: { type: "number" },
    },
    required: ["value", "mean", "standardDeviation"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: { zScore: { type: "number" } },
    required: ["zScore"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "mean",
        label: "Mean",
        required: true,
        valueType: { format: "mean", type: "number" },
      },
      {
        id: "standardDeviation",
        label: "Standard deviation",
        required: true,
        valueType: { format: "standard-deviation", type: "number" },
      },
    ],
    outputs: [
      {
        id: "zScore",
        label: "Z score",
        valueType: { format: "z-score", type: "number" },
      },
    ],
  },
  title: "Z-Score Calculator",
});
export default zScoreTool;
