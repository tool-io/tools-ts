import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleValue: number;
  readonly suppliedDetectionLimit: number;
  readonly equalityCounts: boolean;
};
export type Output = { readonly detectedUnderPolicy: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleValue: { type: "number" },
    suppliedDetectionLimit: { type: "number", minimum: 0 },
    equalityCounts: { type: "boolean" },
  },
  required: ["sampleValue", "suppliedDetectionLimit", "equalityCounts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { detectedUnderPolicy: { type: "boolean" } },
  required: ["detectedUnderPolicy"],
} as const;
/** Compare an explicit sample result with a supplied detection limit and equality policy without substituting censored values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleValue, suppliedDetectionLimit, equalityCounts } = request;
  const compute = (): Output => {
    H.domain(suppliedDetectionLimit >= 0, "suppliedDetectionLimit");
    return {
      detectedUnderPolicy: equalityCounts
        ? sampleValue >= suppliedDetectionLimit
        : sampleValue > suppliedDetectionLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleValue: 0.8,
    suppliedDetectionLimit: 0.5,
    equalityCounts: false,
  },
  output: { detectedUnderPolicy: true },
} satisfies ToolExample<Input, Output>;
export const remediationSampleDetectionFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioremediation", "biology"],
      keywords: ["bioremediation", "biology"],
    },
    id: "bioremediation/remediation-sample-detection-flag",
    title: "Remediation Sample Detection Flag",
    description:
      "Compare an explicit sample result with a supplied detection limit and equality policy without substituting censored values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleValue: { type: "number" },
        suppliedDetectionLimit: { type: "number", minimum: 0 },
        equalityCounts: { type: "boolean" },
      },
      required: ["sampleValue", "suppliedDetectionLimit", "equalityCounts"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { detectedUnderPolicy: { type: "boolean" } },
      required: ["detectedUnderPolicy"],
    },
    ports: {
      inputs: [
        {
          id: "sampleValue",
          label: "Sample Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDetectionLimit",
          label: "Supplied Detection Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityCounts",
          label: "Equality Counts",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "detectedUnderPolicy",
          label: "Detected Under Policy",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = remediationSampleDetectionFlagTool.execute;
export default remediationSampleDetectionFlagTool;
