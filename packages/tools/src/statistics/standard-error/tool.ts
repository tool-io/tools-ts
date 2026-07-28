import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
export type StandardErrorInput = {
  readonly sampleSize: number;
  readonly standardDeviation: number;
};
export type StandardErrorOutput = { readonly standardError: number };
export const standardErrorExample = {
  input: { sampleSize: 25, standardDeviation: 10 },
} satisfies ToolExample<StandardErrorInput>;
export const calculateStandardError = (
  input: unknown,
): ToolResult<StandardErrorOutput> => {
  if (typeof input !== "object" || input === null || Array.isArray(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const { sampleSize, standardDeviation } = input as Record<string, unknown>;
  if (
    typeof standardDeviation !== "number" ||
    !Number.isFinite(standardDeviation) ||
    standardDeviation < 0 ||
    typeof sampleSize !== "number" ||
    !Number.isSafeInteger(sampleSize) ||
    sampleSize < 1
  )
    return invalidInput([
      {
        code: "valid_standard_error_input_required",
        field: "sampleSize",
        message:
          "Standard deviation must be nonnegative and sample size must be a positive integer.",
      },
    ]);
  return toolSuccess({
    standardError: standardDeviation / Math.sqrt(sampleSize),
  });
};
export const standardErrorTool = defineTool<
  StandardErrorInput,
  StandardErrorOutput
>({
  contractVersion: 1,
  description:
    "Calculate standard error from standard deviation and sample size.",
  execute: calculateStandardError,
  execution: { kind: "pure" },
  id: "statistics/standard-error",
  inputSchema: {
    additionalProperties: false,
    properties: {
      sampleSize: { minimum: 1, type: "integer" },
      standardDeviation: { minimum: 0, type: "number" },
    },
    required: ["standardDeviation", "sampleSize"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: { standardError: { minimum: 0, type: "number" } },
    required: ["standardError"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "standardDeviation",
        label: "Standard deviation",
        required: true,
        valueType: { format: "standard-deviation", type: "number" },
      },
      {
        id: "sampleSize",
        label: "Sample size",
        required: true,
        valueType: { format: "count", type: "integer" },
      },
    ],
    outputs: [
      {
        id: "standardError",
        label: "Standard error",
        valueType: { format: "standard-error", type: "number" },
      },
    ],
  },
  title: "Standard Error Calculator",
});
export default standardErrorTool;
