import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly perFrequency: number;
  readonly wavelength: number;
  readonly lightSpeed: number;
};
export type Output = { readonly perWavelength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perFrequency: { type: "number" },
    wavelength: { type: "number", exclusiveMinimum: 0 },
    lightSpeed: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["perFrequency", "wavelength", "lightSpeed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { perWavelength: { type: "number" } },
  required: ["perWavelength"],
} as const;
/** Convert spectral density per hertz to density per metre using the absolute frequency/wavelength Jacobian. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { perFrequency, wavelength, lightSpeed } = input;
  const compute = (): Output => {
    H.positive(wavelength);
    H.positive(lightSpeed);
    return {
      perWavelength: (perFrequency * lightSpeed) / (wavelength * wavelength),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { perFrequency: 4, wavelength: 2, lightSpeed: 299792458 },
  output: { perWavelength: 299792458 },
} satisfies ToolExample<Input, Output>;
export const spectralFluxFrequencyWavelengthJacobianTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/spectral-flux-frequency-wavelength-jacobian",
      title: "Spectral Flux Frequency Wavelength Jacobian Tool",
      description:
        "Convert spectral density per hertz to density per metre using the absolute frequency/wavelength Jacobian.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          perFrequency: { type: "number" },
          wavelength: { type: "number", exclusiveMinimum: 0 },
          lightSpeed: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["perFrequency", "wavelength", "lightSpeed"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { perWavelength: { type: "number" } },
        required: ["perWavelength"],
      },
      ports: {
        inputs: [
          {
            id: "perFrequency",
            label: "Per Frequency",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "wavelength",
            label: "Wavelength",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lightSpeed",
            label: "Light Speed",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "perWavelength",
            label: "Per Wavelength",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = spectralFluxFrequencyWavelengthJacobianTool.execute;
export default spectralFluxFrequencyWavelengthJacobianTool;
