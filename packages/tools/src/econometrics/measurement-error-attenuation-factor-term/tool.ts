import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signalVariance: number;
  readonly errorVariance: number;
  readonly trueSlope: number;
};
export type Output = {
  readonly reliability: number;
  readonly expectedSlope: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signalVariance: { type: "number", minimum: 0 },
    errorVariance: { type: "number", minimum: 0 },
    trueSlope: { type: "number" },
  },
  required: ["signalVariance", "errorVariance", "trueSlope"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reliability: { type: "number" },
    expectedSlope: { type: "number" },
  },
  required: ["reliability", "expectedSlope"],
} as const;
/** Classical independent additive regressor measurement-error attenuation model with explicit variances. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signalVariance, errorVariance, trueSlope } = request;
  const compute = (): Output => {
    H.domain(
      signalVariance >= 0 &&
        errorVariance >= 0 &&
        signalVariance + errorVariance > 0,
    );
    return {
      reliability: signalVariance / (signalVariance + errorVariance),
      expectedSlope:
        (trueSlope * signalVariance) / (signalVariance + errorVariance),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signalVariance: 4, errorVariance: 1, trueSlope: 2 },
  output: { reliability: 0.8, expectedSlope: 1.6 },
} satisfies ToolExample<Input, Output>;
export const measurementErrorAttenuationFactorTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "econometrics/measurement-error-attenuation-factor-term",
      title: "Measurement Error Attenuation Factor Term Tool",
      description:
        "Classical independent additive regressor measurement-error attenuation model with explicit variances.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signalVariance: { type: "number", minimum: 0 },
          errorVariance: { type: "number", minimum: 0 },
          trueSlope: { type: "number" },
        },
        required: ["signalVariance", "errorVariance", "trueSlope"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reliability: { type: "number" },
          expectedSlope: { type: "number" },
        },
        required: ["reliability", "expectedSlope"],
      },
      ports: {
        inputs: [
          {
            id: "signalVariance",
            label: "Signal Variance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "errorVariance",
            label: "Error Variance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "trueSlope",
            label: "True Slope",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "reliability",
            label: "Reliability",
            valueType: { type: "number" },
          },
          {
            id: "expectedSlope",
            label: "Expected Slope",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = measurementErrorAttenuationFactorTermTool.execute;
export default measurementErrorAttenuationFactorTermTool;
