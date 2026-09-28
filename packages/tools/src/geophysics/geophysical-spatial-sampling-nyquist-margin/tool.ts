import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleSpacing: number;
  readonly targetWavelength: number;
};
export type Output = {
  readonly nyquistWavelength: number;
  readonly spacingMargin: number;
  readonly resolves: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleSpacing: { type: "number", exclusiveMinimum: 0 },
    targetWavelength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sampleSpacing", "targetWavelength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nyquistWavelength: { type: "number" },
    spacingMargin: { type: "number" },
    resolves: { type: "boolean" },
  },
  required: ["nyquistWavelength", "spacingMargin", "resolves"],
} as const;
/** Ideal band-limited Nyquist spacing condition; the equality boundary does not guarantee recovery of an unknown phase. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleSpacing, targetWavelength } = request;
  const compute = (): Output => {
    H.positive(sampleSpacing);
    H.positive(targetWavelength);
    return {
      nyquistWavelength: 2 * sampleSpacing,
      spacingMargin: targetWavelength / 2 - sampleSpacing,
      resolves: sampleSpacing <= targetWavelength / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleSpacing: 5, targetWavelength: 20 },
  output: { nyquistWavelength: 10, spacingMargin: 5, resolves: true },
} satisfies ToolExample<Input, Output>;
export const geophysicalSpatialSamplingNyquistMarginTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geophysics/geophysical-spatial-sampling-nyquist-margin",
      title: "Geophysical Spatial Sampling Nyquist Margin Tool",
      description:
        "Ideal band-limited Nyquist spacing condition; the equality boundary does not guarantee recovery of an unknown phase.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sampleSpacing: { type: "number", exclusiveMinimum: 0 },
          targetWavelength: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["sampleSpacing", "targetWavelength"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nyquistWavelength: { type: "number" },
          spacingMargin: { type: "number" },
          resolves: { type: "boolean" },
        },
        required: ["nyquistWavelength", "spacingMargin", "resolves"],
      },
      ports: {
        inputs: [
          {
            id: "sampleSpacing",
            label: "Sample Spacing",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetWavelength",
            label: "Target Wavelength",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "nyquistWavelength",
            label: "Nyquist Wavelength",
            valueType: { type: "number" },
          },
          {
            id: "spacingMargin",
            label: "Spacing Margin",
            valueType: { type: "number" },
          },
          { id: "resolves", label: "Resolves", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = geophysicalSpatialSamplingNyquistMarginTool.execute;
export default geophysicalSpatialSamplingNyquistMarginTool;
