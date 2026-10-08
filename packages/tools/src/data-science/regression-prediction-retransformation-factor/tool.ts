import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly logPrediction: number;
  readonly suppliedSmearingFactor: number;
};
export type Output = { readonly retransformedPrediction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logPrediction: { type: "number" },
    suppliedSmearingFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["logPrediction", "suppliedSmearingFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { retransformedPrediction: { type: "number" } },
  required: ["retransformedPrediction"],
} as const;
/** Apply an explicit positive smearing factor after exponentiating a natural-log prediction without estimating residual correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { logPrediction, suppliedSmearingFactor } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(suppliedSmearingFactor) && suppliedSmearingFactor > 0,
      "suppliedSmearingFactor",
    ),
      suppliedSmearingFactor);
    return {
      retransformedPrediction: Math.exp(logPrediction) * suppliedSmearingFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { logPrediction: 0, suppliedSmearingFactor: 1.5 },
  output: { retransformedPrediction: 1.5 },
} satisfies ToolExample<Input, Output>;
export const regressionPredictionRetransformationFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "data-science/regression-prediction-retransformation-factor",
      title: "Regression Prediction Retransformation Factor Tool",
      description:
        "Apply an explicit positive smearing factor after exponentiating a natural-log prediction without estimating residual correction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          logPrediction: { type: "number" },
          suppliedSmearingFactor: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["logPrediction", "suppliedSmearingFactor"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { retransformedPrediction: { type: "number" } },
        required: ["retransformedPrediction"],
      },
      ports: {
        inputs: [
          {
            id: "logPrediction",
            label: "Log Prediction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedSmearingFactor",
            label: "Supplied Smearing Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "retransformedPrediction",
            label: "Retransformed Prediction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = regressionPredictionRetransformationFactorTool.execute;
export default regressionPredictionRetransformationFactorTool;
