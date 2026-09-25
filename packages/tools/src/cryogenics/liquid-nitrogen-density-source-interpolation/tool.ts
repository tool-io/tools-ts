import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerTemperature: number;
  readonly upperTemperature: number;
  readonly lowerDensity: number;
  readonly upperDensity: number;
  readonly temperature: number;
};
export type Output = { readonly density: number; readonly slope: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerTemperature: { type: "number" },
    upperTemperature: { type: "number" },
    lowerDensity: { type: "number", exclusiveMinimum: 0 },
    upperDensity: { type: "number", exclusiveMinimum: 0 },
    temperature: { type: "number" },
  },
  required: [
    "lowerTemperature",
    "upperTemperature",
    "lowerDensity",
    "upperDensity",
    "temperature",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { density: { type: "number" }, slope: { type: "number" } },
  required: ["density", "slope"],
} as const;
/** Linear interpolation only between caller-supplied source densities at a shared pressure/state basis; no property table or phase validity is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    lowerTemperature,
    upperTemperature,
    lowerDensity,
    upperDensity,
    temperature,
  } = request;
  const compute = (): Output => {
    H.domain(
      upperTemperature > lowerTemperature &&
        temperature >= lowerTemperature &&
        temperature <= upperTemperature &&
        lowerDensity > 0 &&
        upperDensity > 0,
    );
    return {
      density:
        lowerDensity +
        ((upperDensity - lowerDensity) * (temperature - lowerTemperature)) /
          (upperTemperature - lowerTemperature),
      slope:
        (upperDensity - lowerDensity) / (upperTemperature - lowerTemperature),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lowerTemperature: 70,
    upperTemperature: 80,
    lowerDensity: 850,
    upperDensity: 800,
    temperature: 76,
  },
  output: { density: 820, slope: -5 },
} satisfies ToolExample<Input, Output>;
export const liquidNitrogenDensitySourceInterpolationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cryogenics/liquid-nitrogen-density-source-interpolation",
      title: "Liquid Nitrogen Density Source Interpolation Tool",
      description:
        "Linear interpolation only between caller-supplied source densities at a shared pressure/state basis; no property table or phase validity is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lowerTemperature: { type: "number" },
          upperTemperature: { type: "number" },
          lowerDensity: { type: "number", exclusiveMinimum: 0 },
          upperDensity: { type: "number", exclusiveMinimum: 0 },
          temperature: { type: "number" },
        },
        required: [
          "lowerTemperature",
          "upperTemperature",
          "lowerDensity",
          "upperDensity",
          "temperature",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { density: { type: "number" }, slope: { type: "number" } },
        required: ["density", "slope"],
      },
      ports: {
        inputs: [
          {
            id: "lowerTemperature",
            label: "Lower Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upperTemperature",
            label: "Upper Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lowerDensity",
            label: "Lower Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upperDensity",
            label: "Upper Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "temperature",
            label: "Temperature",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "density", label: "Density", valueType: { type: "number" } },
          { id: "slope", label: "Slope", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = liquidNitrogenDensitySourceInterpolationTool.execute;
export default liquidNitrogenDensitySourceInterpolationTool;
