import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceWavelength: number;
  readonly targetWavelength: number;
  readonly referenceScattering: number;
};
export type Output = { readonly ratio: number; readonly scattering: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceWavelength: { type: "number", exclusiveMinimum: 0 },
    targetWavelength: { type: "number", exclusiveMinimum: 0 },
    referenceScattering: { type: "number", minimum: 0 },
  },
  required: ["referenceWavelength", "targetWavelength", "referenceScattering"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" }, scattering: { type: "number" } },
  required: ["ratio", "scattering"],
} as const;
/** Pure inverse-fourth-power Rayleigh scaling with refractive-index and composition changes excluded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceWavelength, targetWavelength, referenceScattering } =
    request;
  const compute = (): Output => {
    H.positive(referenceWavelength);
    H.positive(targetWavelength);
    H.domain(referenceScattering >= 0);
    return {
      ratio: (referenceWavelength / targetWavelength) ** 4,
      scattering:
        referenceScattering * (referenceWavelength / targetWavelength) ** 4,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceWavelength: 400,
    targetWavelength: 800,
    referenceScattering: 16,
  },
  output: { ratio: 0.0625, scattering: 1 },
} satisfies ToolExample<Input, Output>;
export const rayleighScatteringWavelengthRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/rayleigh-scattering-wavelength-ratio",
    title: "Rayleigh Scattering Wavelength Ratio Tool",
    description:
      "Pure inverse-fourth-power Rayleigh scaling with refractive-index and composition changes excluded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceWavelength: { type: "number", exclusiveMinimum: 0 },
        targetWavelength: { type: "number", exclusiveMinimum: 0 },
        referenceScattering: { type: "number", minimum: 0 },
      },
      required: [
        "referenceWavelength",
        "targetWavelength",
        "referenceScattering",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" }, scattering: { type: "number" } },
      required: ["ratio", "scattering"],
    },
    ports: {
      inputs: [
        {
          id: "referenceWavelength",
          label: "Reference Wavelength",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetWavelength",
          label: "Target Wavelength",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceScattering",
          label: "Reference Scattering",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        {
          id: "scattering",
          label: "Scattering",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rayleighScatteringWavelengthRatioTool.execute;
export default rayleighScatteringWavelengthRatioTool;
