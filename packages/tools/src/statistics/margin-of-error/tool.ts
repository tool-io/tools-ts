import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
export type MarginOfErrorInput = {
  readonly confidenceLevel?: number;
  readonly sampleSize: number;
  readonly standardDeviation: number;
};
export type MarginOfErrorOutput = {
  readonly criticalValue: number;
  readonly marginOfError: number;
  readonly standardError: number;
};

export const marginOfErrorExample = {
  input: { confidenceLevel: 0.95, sampleSize: 100, standardDeviation: 10 },
} satisfies ToolExample<MarginOfErrorInput>;

export const inverseNormalCdf = (probability: number): number => {
  const a = [
    -39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269,
    -30.66479806614716, 2.506628277459239,
  ];
  const b = [
    -54.47609879822406, 161.5858368580409, -155.6989798598866,
    66.80131188771972, -13.28068155288572,
  ];
  const c = [
    -0.007784894002430293, -0.3223964580411365, -2.400758277161838,
    -2.549732539343734, 4.374664141464968, 2.938163982698783,
  ];
  const d = [
    0.007784695709041462, 0.3224671290700398, 2.445134137142996,
    3.754408661907416,
  ];
  if (!(probability > 0 && probability < 1)) return Number.NaN;
  if (probability < 0.02425) {
    const q = Math.sqrt(-2 * Math.log(probability));
    return (
      (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q +
        c[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
    );
  }
  if (probability > 0.97575) {
    const q = Math.sqrt(-2 * Math.log(1 - probability));
    return (
      -(
        ((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q +
        c[5]!
      ) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
    );
  }
  const q = probability - 0.5;
  const r = q * q;
  return (
    ((((((a[0]! * r + a[1]!) * r + a[2]!) * r + a[3]!) * r + a[4]!) * r +
      a[5]!) *
      q) /
    (((((b[0]! * r + b[1]!) * r + b[2]!) * r + b[3]!) * r + b[4]!) * r + 1)
  );
};

export const calculateMarginOfError = (
  input: unknown,
): ToolResult<MarginOfErrorOutput> => {
  if (typeof input !== "object" || input === null || Array.isArray(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const {
    confidenceLevel = 0.95,
    sampleSize,
    standardDeviation,
  } = input as Record<string, unknown>;
  if (
    typeof confidenceLevel !== "number" ||
    !Number.isFinite(confidenceLevel) ||
    confidenceLevel <= 0 ||
    confidenceLevel >= 1 ||
    typeof standardDeviation !== "number" ||
    !Number.isFinite(standardDeviation) ||
    standardDeviation < 0 ||
    typeof sampleSize !== "number" ||
    !Number.isSafeInteger(sampleSize) ||
    sampleSize < 1
  )
    return invalidInput([
      {
        code: "valid_margin_input_required",
        field: "confidenceLevel",
        message:
          "Confidence must lie between zero and one, deviation be nonnegative, and sample size be positive.",
      },
    ]);
  const criticalValue = inverseNormalCdf(0.5 + confidenceLevel / 2);
  const standardError = standardDeviation / Math.sqrt(sampleSize);
  return toolSuccess({
    criticalValue,
    marginOfError: criticalValue * standardError,
    standardError,
  });
};
export const marginOfErrorTool = defineTool<
  MarginOfErrorInput,
  MarginOfErrorOutput
>({
  contractVersion: 1,
  description: "Calculate a normal-approximation margin of error for a mean.",
  execute: calculateMarginOfError,
  execution: { kind: "pure" },
  id: "statistics/margin-of-error",
  inputSchema: {
    additionalProperties: false,
    properties: {
      confidenceLevel: {
        default: 0.95,
        exclusiveMaximum: 1,
        exclusiveMinimum: 0,
        type: "number",
      },
      sampleSize: { minimum: 1, type: "integer" },
      standardDeviation: { minimum: 0, type: "number" },
    },
    required: ["standardDeviation", "sampleSize"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      criticalValue: { exclusiveMinimum: 0, type: "number" },
      marginOfError: { minimum: 0, type: "number" },
      standardError: { minimum: 0, type: "number" },
    },
    required: ["criticalValue", "marginOfError", "standardError"],
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
      {
        id: "confidenceLevel",
        label: "Confidence level",
        valueType: { format: "probability", type: "number" },
      },
    ],
    outputs: [
      {
        id: "marginOfError",
        label: "Margin of error",
        valueType: { format: "margin-of-error", type: "number" },
      },
      {
        id: "criticalValue",
        label: "Critical z value",
        valueType: { format: "z-score", type: "number" },
      },
      {
        id: "standardError",
        label: "Standard error",
        valueType: { format: "standard-error", type: "number" },
      },
    ],
  },
  title: "Margin of Error Calculator",
});
export default marginOfErrorTool;
