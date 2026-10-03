import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sumSquaredDeviations: number;
  readonly sampleCount: number;
  readonly reportedVariance: number;
  readonly correction: number;
};
export type Output = {
  readonly expectedVariance: number;
  readonly residual: number;
  readonly denominator: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sumSquaredDeviations: { type: "number", minimum: 0 },
    sampleCount: { type: "integer", minimum: 1 },
    reportedVariance: { type: "number", minimum: 0 },
    correction: { type: "integer", minimum: 0 },
  },
  required: [
    "sumSquaredDeviations",
    "sampleCount",
    "reportedVariance",
    "correction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedVariance: { type: "number" },
    residual: { type: "number" },
    denominator: { type: "integer" },
  },
  required: ["expectedVariance", "residual", "denominator"],
} as const;
/** Calculate sample variance denominator residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sumSquaredDeviations, sampleCount, reportedVariance, correction } =
    request;
  const compute = (): Output => {
    H.domain(sumSquaredDeviations >= 0 && reportedVariance >= 0);
    H.integer(sampleCount, 1);
    H.integer(correction, 0, sampleCount - 1);
    return {
      expectedVariance: sumSquaredDeviations / (sampleCount - correction),
      residual:
        reportedVariance - sumSquaredDeviations / (sampleCount - correction),
      denominator: sampleCount - correction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sumSquaredDeviations: 12,
    sampleCount: 5,
    reportedVariance: 4,
    correction: 1,
  },
  output: { expectedVariance: 3, residual: 1, denominator: 4 },
} satisfies ToolExample<Input, Output>;
export const sampleVarianceDenominatorResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/sample-variance-denominator-residual",
    title: "Sample Variance Denominator Residual Tool",
    description:
      "Calculate sample variance denominator residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sumSquaredDeviations: { type: "number", minimum: 0 },
        sampleCount: { type: "integer", minimum: 1 },
        reportedVariance: { type: "number", minimum: 0 },
        correction: { type: "integer", minimum: 0 },
      },
      required: [
        "sumSquaredDeviations",
        "sampleCount",
        "reportedVariance",
        "correction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedVariance: { type: "number" },
        residual: { type: "number" },
        denominator: { type: "integer" },
      },
      required: ["expectedVariance", "residual", "denominator"],
    },
    ports: {
      inputs: [
        {
          id: "sumSquaredDeviations",
          label: "Sum Squared Deviations",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleCount",
          label: "Sample Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reportedVariance",
          label: "Reported Variance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "correction",
          label: "Correction",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "expectedVariance",
          label: "Expected Variance",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleVarianceDenominatorResidualTool.execute;
export default sampleVarianceDenominatorResidualTool;
