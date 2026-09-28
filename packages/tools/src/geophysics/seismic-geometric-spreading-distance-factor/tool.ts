import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceAmplitude: number;
  readonly referenceDistance: number;
  readonly distance: number;
  readonly exponent: number;
};
export type Output = { readonly amplitude: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceAmplitude: { type: "number" },
    referenceDistance: { type: "number", exclusiveMinimum: 0 },
    distance: { type: "number", exclusiveMinimum: 0 },
    exponent: { type: "number" },
  },
  required: ["referenceAmplitude", "referenceDistance", "distance", "exponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { amplitude: { type: "number" } },
  required: ["amplitude"],
} as const;
/** Explicit amplitude power-law spreading, exponent 1 for spherical and 1/2 for ideal cylindrical spreading; no attenuation included. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceAmplitude, referenceDistance, distance, exponent } = request;
  const compute = (): Output => {
    H.positive(referenceDistance);
    H.positive(distance);
    return {
      amplitude:
        referenceAmplitude * (referenceDistance / distance) ** exponent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceAmplitude: 10,
    referenceDistance: 1,
    distance: 4,
    exponent: 1,
  },
  output: { amplitude: 2.5 },
} satisfies ToolExample<Input, Output>;
export const seismicGeometricSpreadingDistanceFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geophysics/seismic-geometric-spreading-distance-factor",
      title: "Seismic Geometric Spreading Distance Factor Tool",
      description:
        "Explicit amplitude power-law spreading, exponent 1 for spherical and 1/2 for ideal cylindrical spreading; no attenuation included.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceAmplitude: { type: "number" },
          referenceDistance: { type: "number", exclusiveMinimum: 0 },
          distance: { type: "number", exclusiveMinimum: 0 },
          exponent: { type: "number" },
        },
        required: [
          "referenceAmplitude",
          "referenceDistance",
          "distance",
          "exponent",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { amplitude: { type: "number" } },
        required: ["amplitude"],
      },
      ports: {
        inputs: [
          {
            id: "referenceAmplitude",
            label: "Reference Amplitude",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceDistance",
            label: "Reference Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "distance",
            label: "Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exponent",
            label: "Exponent",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "amplitude",
            label: "Amplitude",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = seismicGeometricSpreadingDistanceFactorTool.execute;
export default seismicGeometricSpreadingDistanceFactorTool;
