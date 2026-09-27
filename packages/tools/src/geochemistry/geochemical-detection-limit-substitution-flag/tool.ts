import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedValue: number;
  readonly detectionLimit: number;
  readonly belowDetection: boolean;
  readonly substitutionFraction: number;
};
export type Output = {
  readonly analysisValue: number;
  readonly substituted: boolean;
  readonly exceedsReportedLimit: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedValue: { type: "number" },
    detectionLimit: { type: "number", minimum: 0 },
    belowDetection: { type: "boolean" },
    substitutionFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "reportedValue",
    "detectionLimit",
    "belowDetection",
    "substitutionFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    analysisValue: { type: "number" },
    substituted: { type: "boolean" },
    exceedsReportedLimit: { type: "boolean" },
  },
  required: ["analysisValue", "substituted", "exceedsReportedLimit"],
} as const;
/** Explicit caller-requested substitution for censored observations with an audit flag; not an inferential recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    reportedValue,
    detectionLimit,
    belowDetection,
    substitutionFraction,
  } = request;
  const compute = (): Output => {
    H.domain(detectionLimit >= 0);
    H.probability(substitutionFraction);
    return {
      analysisValue: belowDetection
        ? detectionLimit * substitutionFraction
        : reportedValue,
      substituted: belowDetection,
      exceedsReportedLimit: belowDetection && reportedValue > detectionLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reportedValue: 0.2,
    detectionLimit: 1,
    belowDetection: true,
    substitutionFraction: 0.5,
  },
  output: {
    analysisValue: 0.5,
    substituted: true,
    exceedsReportedLimit: false,
  },
} satisfies ToolExample<Input, Output>;
export const geochemicalDetectionLimitSubstitutionFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geochemistry/geochemical-detection-limit-substitution-flag",
      title: "Geochemical Detection Limit Substitution Flag Tool",
      description:
        "Explicit caller-requested substitution for censored observations with an audit flag; not an inferential recommendation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reportedValue: { type: "number" },
          detectionLimit: { type: "number", minimum: 0 },
          belowDetection: { type: "boolean" },
          substitutionFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "reportedValue",
          "detectionLimit",
          "belowDetection",
          "substitutionFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          analysisValue: { type: "number" },
          substituted: { type: "boolean" },
          exceedsReportedLimit: { type: "boolean" },
        },
        required: ["analysisValue", "substituted", "exceedsReportedLimit"],
      },
      ports: {
        inputs: [
          {
            id: "reportedValue",
            label: "Reported Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "detectionLimit",
            label: "Detection Limit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "belowDetection",
            label: "Below Detection",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "substitutionFraction",
            label: "Substitution Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "analysisValue",
            label: "Analysis Value",
            valueType: { type: "number" },
          },
          {
            id: "substituted",
            label: "Substituted",
            valueType: { type: "boolean" },
          },
          {
            id: "exceedsReportedLimit",
            label: "Exceeds Reported Limit",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = geochemicalDetectionLimitSubstitutionFlagTool.execute;
export default geochemicalDetectionLimitSubstitutionFlagTool;
