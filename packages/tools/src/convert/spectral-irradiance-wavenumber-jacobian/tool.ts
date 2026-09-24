import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly perWavelength: number;
  readonly wavenumber: number;
};
export type Output = { readonly perWavenumber: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perWavelength: { type: "number" },
    wavenumber: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["perWavelength", "wavenumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { perWavenumber: { type: "number" } },
  required: ["perWavenumber"],
} as const;
/** Convert a density per metre wavelength to per inverse metre wavenumber using wavelength=1/wavenumber. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { perWavelength, wavenumber } = request;
  const compute = (): Output => {
    H.positive(wavenumber);
    return { perWavenumber: perWavelength / (wavenumber * wavenumber) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { perWavelength: 8, wavenumber: 2 },
  output: { perWavenumber: 2 },
} satisfies ToolExample<Input, Output>;
export const spectralIrradianceWavenumberJacobianTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/spectral-irradiance-wavenumber-jacobian",
      title: "Spectral Irradiance Wavenumber Jacobian Tool",
      description:
        "Convert a density per metre wavelength to per inverse metre wavenumber using wavelength=1/wavenumber.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          perWavelength: { type: "number" },
          wavenumber: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["perWavelength", "wavenumber"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { perWavenumber: { type: "number" } },
        required: ["perWavenumber"],
      },
      ports: {
        inputs: [
          {
            id: "perWavelength",
            label: "Per Wavelength",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "wavenumber",
            label: "Wavenumber",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "perWavenumber",
            label: "Per Wavenumber",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = spectralIrradianceWavenumberJacobianTool.execute;
export default spectralIrradianceWavenumberJacobianTool;
