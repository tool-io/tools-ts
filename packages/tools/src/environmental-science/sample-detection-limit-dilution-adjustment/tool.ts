import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedDetectionLimit: number;
  readonly suppliedDilutionFactor: number;
};
export type Output = { readonly adjustedDetectionLimit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedDetectionLimit: { type: "number", minimum: 0 },
    suppliedDilutionFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["reportedDetectionLimit", "suppliedDilutionFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { adjustedDetectionLimit: { type: "number" } },
  required: ["adjustedDetectionLimit"],
} as const;
/** Apply an explicit analytical dilution factor to a detection limit on the same concentration basis without changing censored observations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedDetectionLimit, suppliedDilutionFactor } = request;
  const compute = (): Output => {
    H.domain(reportedDetectionLimit >= 0, "reportedDetectionLimit");
    (H.domain(
      Number.isFinite(suppliedDilutionFactor) && suppliedDilutionFactor > 0,
      "suppliedDilutionFactor",
    ),
      suppliedDilutionFactor);
    return {
      adjustedDetectionLimit: reportedDetectionLimit * suppliedDilutionFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedDetectionLimit: 0.5, suppliedDilutionFactor: 4 },
  output: { adjustedDetectionLimit: 2 },
} satisfies ToolExample<Input, Output>;
export const sampleDetectionLimitDilutionAdjustmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "environmental-science",
          "environmental science",
          "earth and environmental sciences",
        ],
        keywords: ["environmental science", "earth and environmental sciences"],
      },
      id: "environmental-science/sample-detection-limit-dilution-adjustment",
      title: "Sample Detection Limit Dilution Adjustment",
      description:
        "Apply an explicit analytical dilution factor to a detection limit on the same concentration basis without changing censored observations.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reportedDetectionLimit: { type: "number", minimum: 0 },
          suppliedDilutionFactor: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["reportedDetectionLimit", "suppliedDilutionFactor"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { adjustedDetectionLimit: { type: "number" } },
        required: ["adjustedDetectionLimit"],
      },
      ports: {
        inputs: [
          {
            id: "reportedDetectionLimit",
            label: "Reported Detection Limit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedDilutionFactor",
            label: "Supplied Dilution Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "adjustedDetectionLimit",
            label: "Adjusted Detection Limit",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = sampleDetectionLimitDilutionAdjustmentTool.execute;
export default sampleDetectionLimitDilutionAdjustmentTool;
