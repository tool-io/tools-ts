import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedModulus: number;
  readonly modelModulus: number;
};
export type Output = {
  readonly modulusResidual: number;
  readonly observedToModelDistanceRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedModulus: { type: "number" },
    modelModulus: { type: "number" },
  },
  required: ["observedModulus", "modelModulus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modulusResidual: { type: "number" },
    observedToModelDistanceRatio: { type: "number" },
  },
  required: ["modulusResidual", "observedToModelDistanceRatio"],
} as const;
/** Convert an explicit standard-candle distance-modulus residual into its corresponding inferred distance ratio under a matched calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedModulus, modelModulus } = request;
  const compute = (): Output => {
    return {
      modulusResidual: observedModulus - modelModulus,
      observedToModelDistanceRatio:
        10 ** ((observedModulus - modelModulus) / 5),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedModulus: 35, modelModulus: 30 },
  output: { modulusResidual: 5, observedToModelDistanceRatio: 10 },
} satisfies ToolExample<Input, Output>;
export const standardcandleDistanceModulusResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["cosmology", "physics"],
        keywords: ["cosmology", "physics"],
      },
      id: "cosmology/standard-candle-distance-modulus-residual",
      title: "Standard Candle Distance Modulus Residual",
      description:
        "Convert an explicit standard-candle distance-modulus residual into its corresponding inferred distance ratio under a matched calibration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedModulus: { type: "number" },
          modelModulus: { type: "number" },
        },
        required: ["observedModulus", "modelModulus"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          modulusResidual: { type: "number" },
          observedToModelDistanceRatio: { type: "number" },
        },
        required: ["modulusResidual", "observedToModelDistanceRatio"],
      },
      ports: {
        inputs: [
          {
            id: "observedModulus",
            label: "Observed Modulus",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "modelModulus",
            label: "Model Modulus",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "modulusResidual",
            label: "Modulus Residual",
            valueType: { type: "number" },
          },
          {
            id: "observedToModelDistanceRatio",
            label: "Observed To Model Distance Ratio",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = standardcandleDistanceModulusResidualTool.execute;
export default standardcandleDistanceModulusResidualTool;
