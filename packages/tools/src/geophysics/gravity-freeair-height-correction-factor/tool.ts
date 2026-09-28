import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly heightMeters: number;
  readonly gradientMgalPerMeter: number;
  readonly observedMgal: number;
};
export type Output = {
  readonly correctionMgal: number;
  readonly correctedMgal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heightMeters: { type: "number" },
    gradientMgalPerMeter: { type: "number" },
    observedMgal: { type: "number" },
  },
  required: ["heightMeters", "gradientMgalPerMeter", "observedMgal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctionMgal: { type: "number" },
    correctedMgal: { type: "number" },
  },
  required: ["correctionMgal", "correctedMgal"],
} as const;
/** Apply a caller-supplied signed free-air correction gradient; no normal-gravity model or Bouguer correction is included. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { heightMeters, gradientMgalPerMeter, observedMgal } = request;
  const compute = (): Output => {
    return {
      correctionMgal: heightMeters * gradientMgalPerMeter,
      correctedMgal: observedMgal + heightMeters * gradientMgalPerMeter,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    heightMeters: 100,
    gradientMgalPerMeter: 0.3086,
    observedMgal: 980000,
  },
  output: { correctionMgal: 30.86, correctedMgal: 980030.86 },
} satisfies ToolExample<Input, Output>;
export const gravityFreeairHeightCorrectionFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geophysics/gravity-freeair-height-correction-factor",
      title: "Gravity Freeair Height Correction Factor Tool",
      description:
        "Apply a caller-supplied signed free-air correction gradient; no normal-gravity model or Bouguer correction is included.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          heightMeters: { type: "number" },
          gradientMgalPerMeter: { type: "number" },
          observedMgal: { type: "number" },
        },
        required: ["heightMeters", "gradientMgalPerMeter", "observedMgal"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          correctionMgal: { type: "number" },
          correctedMgal: { type: "number" },
        },
        required: ["correctionMgal", "correctedMgal"],
      },
      ports: {
        inputs: [
          {
            id: "heightMeters",
            label: "Height Meters",
            required: true,
            valueType: { type: "number", unit: "m" },
          },
          {
            id: "gradientMgalPerMeter",
            label: "Gradient Mgal Per Meter",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "observedMgal",
            label: "Observed Mgal",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "correctionMgal",
            label: "Correction Mgal",
            valueType: { type: "number" },
          },
          {
            id: "correctedMgal",
            label: "Corrected Mgal",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = gravityFreeairHeightCorrectionFactorTool.execute;
export default gravityFreeairHeightCorrectionFactorTool;
