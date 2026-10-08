import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bandCode: string;
  readonly wavelength: number;
  readonly wavelengthUnit: string;
  readonly source: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bandCode: { type: "string", maxLength: 8192, minLength: 1 },
    wavelength: { type: "number", exclusiveMinimum: 0 },
    wavelengthUnit: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["bandCode", "wavelength", "wavelengthUnit", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied nominal spectral band center without providing sensor specifications or integrating a band response. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bandCode, wavelength, wavelengthUnit, source } = request;
  const compute = (): Output => {
    H.domain(
      bandCode.length > 0 && wavelengthUnit.length > 0 && source.length > 0,
      "bandCode",
    );
    (H.domain(wavelength > 0, "wavelength"), wavelength);
    return {
      label:
        bandCode +
        "; center=" +
        wavelength +
        " " +
        wavelengthUnit +
        " [" +
        source +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    bandCode: "B4",
    wavelength: 665,
    wavelengthUnit: "nm",
    source: "Product A",
  },
  output: { label: "B4; center=665 nm [Product A]" },
} satisfies ToolExample<Input, Output>;
export const earthObservationBandCenterLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "earth-science",
        "earth science",
        "earth and environmental sciences",
      ],
      keywords: ["earth science", "earth and environmental sciences"],
    },
    id: "earth-science/earth-observation-band-center-label",
    title: "Earth Observation Band Center Label",
    description:
      "Label a supplied nominal spectral band center without providing sensor specifications or integrating a band response.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bandCode: { type: "string", maxLength: 8192, minLength: 1 },
        wavelength: { type: "number", exclusiveMinimum: 0 },
        wavelengthUnit: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["bandCode", "wavelength", "wavelengthUnit", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "bandCode",
          label: "Band Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "wavelength",
          label: "Wavelength",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wavelengthUnit",
          label: "Wavelength Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = earthObservationBandCenterLabelTool.execute;
export default earthObservationBandCenterLabelTool;
