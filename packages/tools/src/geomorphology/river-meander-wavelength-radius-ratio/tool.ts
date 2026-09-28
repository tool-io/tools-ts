import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wavelength: number;
  readonly radius: number;
  readonly channelWidth: number;
};
export type Output = {
  readonly wavelengthRadiusRatio: number;
  readonly radiusWidthRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wavelength: { type: "number", minimum: 0 },
    radius: { type: "number", exclusiveMinimum: 0 },
    channelWidth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["wavelength", "radius", "channelWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wavelengthRadiusRatio: { type: "number" },
    radiusWidthRatio: { type: "number" },
  },
  required: ["wavelengthRadiusRatio", "radiusWidthRatio"],
} as const;
/** Calculate river meander wavelength radius ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wavelength, radius, channelWidth } = request;
  const compute = (): Output => {
    H.domain(wavelength >= 0);
    H.positive(radius);
    H.positive(channelWidth);
    return {
      wavelengthRadiusRatio: wavelength / radius,
      radiusWidthRatio: radius / channelWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wavelength: 600, radius: 100, channelWidth: 20 },
  output: { wavelengthRadiusRatio: 6, radiusWidthRatio: 5 },
} satisfies ToolExample<Input, Output>;
export const riverMeanderWavelengthRadiusRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/river-meander-wavelength-radius-ratio",
    title: "River Meander Wavelength Radius Ratio Tool",
    description:
      "Calculate river meander wavelength radius ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wavelength: { type: "number", minimum: 0 },
        radius: { type: "number", exclusiveMinimum: 0 },
        channelWidth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["wavelength", "radius", "channelWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wavelengthRadiusRatio: { type: "number" },
        radiusWidthRatio: { type: "number" },
      },
      required: ["wavelengthRadiusRatio", "radiusWidthRatio"],
    },
    ports: {
      inputs: [
        {
          id: "wavelength",
          label: "Wavelength",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "channelWidth",
          label: "Channel Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wavelengthRadiusRatio",
          label: "Wavelength Radius Ratio",
          valueType: { type: "number" },
        },
        {
          id: "radiusWidthRatio",
          label: "Radius Width Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = riverMeanderWavelengthRadiusRatioTool.execute;
export default riverMeanderWavelengthRadiusRatioTool;
