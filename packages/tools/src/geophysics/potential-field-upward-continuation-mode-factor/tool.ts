import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wavenumberX: number;
  readonly wavenumberY: number;
  readonly height: number;
  readonly real: number;
  readonly imaginary: number;
};
export type Output = {
  readonly factor: number;
  readonly real: number;
  readonly imaginary: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wavenumberX: { type: "number" },
    wavenumberY: { type: "number" },
    height: { type: "number", minimum: 0 },
    real: { type: "number" },
    imaginary: { type: "number" },
  },
  required: ["wavenumberX", "wavenumberY", "height", "real", "imaginary"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    factor: { type: "number" },
    real: { type: "number" },
    imaginary: { type: "number" },
  },
  required: ["factor", "real", "imaginary"],
} as const;
/** One planar Fourier mode upward continuation exp(-|k|h); spatial wavenumbers are radians per length. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wavenumberX, wavenumberY, height, real, imaginary } = request;
  const compute = (): Output => {
    H.domain(height >= 0);
    return {
      factor: Math.exp(-Math.hypot(wavenumberX, wavenumberY) * height),
      real: real * Math.exp(-Math.hypot(wavenumberX, wavenumberY) * height),
      imaginary:
        imaginary * Math.exp(-Math.hypot(wavenumberX, wavenumberY) * height),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    wavenumberX: 3,
    wavenumberY: 4,
    height: 0.2,
    real: 10,
    imaginary: 5,
  },
  output: {
    factor: 0.36787944117144233,
    real: 3.6787944117144233,
    imaginary: 1.8393972058572117,
  },
} satisfies ToolExample<Input, Output>;
export const potentialFieldUpwardContinuationModeFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geophysics/potential-field-upward-continuation-mode-factor",
      title: "Potential Field Upward Continuation Mode Factor Tool",
      description:
        "One planar Fourier mode upward continuation exp(-|k|h); spatial wavenumbers are radians per length.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          wavenumberX: { type: "number" },
          wavenumberY: { type: "number" },
          height: { type: "number", minimum: 0 },
          real: { type: "number" },
          imaginary: { type: "number" },
        },
        required: ["wavenumberX", "wavenumberY", "height", "real", "imaginary"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          factor: { type: "number" },
          real: { type: "number" },
          imaginary: { type: "number" },
        },
        required: ["factor", "real", "imaginary"],
      },
      ports: {
        inputs: [
          {
            id: "wavenumberX",
            label: "Wavenumber X",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "wavenumberY",
            label: "Wavenumber Y",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "height",
            label: "Height",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "real",
            label: "Real",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "imaginary",
            label: "Imaginary",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "factor", label: "Factor", valueType: { type: "number" } },
          { id: "real", label: "Real", valueType: { type: "number" } },
          {
            id: "imaginary",
            label: "Imaginary",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = potentialFieldUpwardContinuationModeFactorTool.execute;
export default potentialFieldUpwardContinuationModeFactorTool;
