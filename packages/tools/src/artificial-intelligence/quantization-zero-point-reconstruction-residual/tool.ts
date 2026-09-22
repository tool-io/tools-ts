import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly original: number;
  readonly quantized: number;
  readonly zeroPoint: number;
  readonly scale: number;
};
export type Output = {
  readonly reconstructed: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    original: { type: "number" },
    quantized: { type: "integer" },
    zeroPoint: { type: "integer" },
    scale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["original", "quantized", "zeroPoint", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reconstructed: { type: "number" },
    residual: { type: "number" },
  },
  required: ["reconstructed", "residual"],
} as const;
/** Affine dequantization of one supplied integer code, without inferring clipping range or a quantizer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { original, quantized, zeroPoint, scale } = request;
  const compute = (): Output => {
    H.positive(scale);
    return {
      reconstructed: scale * (quantized - zeroPoint),
      residual: original - scale * (quantized - zeroPoint),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { original: 1.2, quantized: 15, zeroPoint: 3, scale: 0.1 },
  output: {
    reconstructed: 1.2000000000000002,
    residual: -2.220446049250313e-16,
  },
} satisfies ToolExample<Input, Output>;
export const quantizationZeroPointReconstructionResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "artificial-intelligence/quantization-zero-point-reconstruction-residual",
      title: "Quantization Zero Point Reconstruction Residual Tool",
      description:
        "Affine dequantization of one supplied integer code, without inferring clipping range or a quantizer.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          original: { type: "number" },
          quantized: { type: "integer" },
          zeroPoint: { type: "integer" },
          scale: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["original", "quantized", "zeroPoint", "scale"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reconstructed: { type: "number" },
          residual: { type: "number" },
        },
        required: ["reconstructed", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "original",
            label: "Original",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "quantized",
            label: "Quantized",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "zeroPoint",
            label: "Zero Point",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "scale",
            label: "Scale",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "reconstructed",
            label: "Reconstructed",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = quantizationZeroPointReconstructionResidualTool.execute;
export default quantizationZeroPointReconstructionResidualTool;
