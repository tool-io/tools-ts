import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly unquenched: number;
  readonly quenched: number;
  readonly quencherConcentration: number;
  readonly sternVolmer: number;
};
export type Output = {
  readonly intensityRatio: number;
  readonly linearPrediction: number;
  readonly curvatureResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unquenched: { type: "number", minimum: 0 },
    quenched: { type: "number", exclusiveMinimum: 0 },
    quencherConcentration: { type: "number", minimum: 0 },
    sternVolmer: { type: "number", minimum: 0 },
  },
  required: ["unquenched", "quenched", "quencherConcentration", "sternVolmer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intensityRatio: { type: "number" },
    linearPrediction: { type: "number" },
    curvatureResidual: { type: "number" },
  },
  required: ["intensityRatio", "linearPrediction", "curvatureResidual"],
} as const;
/** One-point residual against an explicitly supplied linear Stern-Volmer intensity model; no quenching mechanism is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unquenched, quenched, quencherConcentration, sternVolmer } = request;
  const compute = (): Output => {
    H.domain(unquenched >= 0 && quencherConcentration >= 0 && sternVolmer >= 0);
    H.positive(quenched);
    return {
      intensityRatio: unquenched / quenched,
      linearPrediction: 1 + sternVolmer * quencherConcentration,
      curvatureResidual:
        unquenched / quenched - 1 - sternVolmer * quencherConcentration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    unquenched: 100,
    quenched: 40,
    quencherConcentration: 2,
    sternVolmer: 0.5,
  },
  output: { intensityRatio: 2.5, linearPrediction: 2, curvatureResidual: 0.5 },
} satisfies ToolExample<Input, Output>;
export const fluorescenceQuenchingCurvatureOnePointTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biochemistry/fluorescence-quenching-curvature-one-point",
      title: "Fluorescence Quenching Curvature One Point Tool",
      description:
        "One-point residual against an explicitly supplied linear Stern-Volmer intensity model; no quenching mechanism is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unquenched: { type: "number", minimum: 0 },
          quenched: { type: "number", exclusiveMinimum: 0 },
          quencherConcentration: { type: "number", minimum: 0 },
          sternVolmer: { type: "number", minimum: 0 },
        },
        required: [
          "unquenched",
          "quenched",
          "quencherConcentration",
          "sternVolmer",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          intensityRatio: { type: "number" },
          linearPrediction: { type: "number" },
          curvatureResidual: { type: "number" },
        },
        required: ["intensityRatio", "linearPrediction", "curvatureResidual"],
      },
      ports: {
        inputs: [
          {
            id: "unquenched",
            label: "Unquenched",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "quenched",
            label: "Quenched",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "quencherConcentration",
            label: "Quencher Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sternVolmer",
            label: "Stern Volmer",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "intensityRatio",
            label: "Intensity Ratio",
            valueType: { type: "number" },
          },
          {
            id: "linearPrediction",
            label: "Linear Prediction",
            valueType: { type: "number" },
          },
          {
            id: "curvatureResidual",
            label: "Curvature Residual",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = fluorescenceQuenchingCurvatureOnePointTool.execute;
export default fluorescenceQuenchingCurvatureOnePointTool;
