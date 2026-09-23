import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly latitude: number;
  readonly longitude: number;
  readonly quantumDegrees: number;
};
export type Output = {
  readonly latitude: number;
  readonly longitude: number;
  readonly quantumDegrees: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latitude: { type: "number", minimum: -90, maximum: 90 },
    longitude: { type: "number", minimum: -180 },
    quantumDegrees: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["latitude", "longitude", "quantumDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latitude: { type: "number" },
    longitude: { type: "number" },
    quantumDegrees: { type: "number" },
  },
  required: ["latitude", "longitude", "quantumDegrees"],
} as const;
/** Quantize supplied geographic coordinates to an explicit grid; no anonymity guarantee is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { latitude, longitude, quantumDegrees } = request;
  const compute = (): Output => {
    H.domain(
      latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180,
      "latitude",
    );
    H.domain(quantumDegrees > 0 && quantumDegrees <= 180, "quantumDegrees");
    return {
      latitude: Math.max(
        -90,
        Math.min(90, Math.round(latitude / quantumDegrees) * quantumDegrees),
      ),
      longitude: Math.max(
        -180,
        Math.min(180, Math.round(longitude / quantumDegrees) * quantumDegrees),
      ),
      quantumDegrees,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { latitude: 51.24, longitude: 13.46, quantumDegrees: 0.5 },
  output: { latitude: 51, longitude: 13.5, quantumDegrees: 0.5 },
} satisfies ToolExample<Input, Output>;
export const biomonitoringRecordLocationPrecisionMaskTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biomonitoring/biomonitoring-record-location-precision-mask",
      title: "Biomonitoring Record Location Precision Mask Tool",
      description:
        "Quantize supplied geographic coordinates to an explicit grid; no anonymity guarantee is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          latitude: { type: "number", minimum: -90, maximum: 90 },
          longitude: { type: "number", minimum: -180 },
          quantumDegrees: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["latitude", "longitude", "quantumDegrees"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          latitude: { type: "number" },
          longitude: { type: "number" },
          quantumDegrees: { type: "number" },
        },
        required: ["latitude", "longitude", "quantumDegrees"],
      },
      ports: {
        inputs: [
          {
            id: "latitude",
            label: "Latitude",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "longitude",
            label: "Longitude",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "quantumDegrees",
            label: "Quantum Degrees",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "latitude", label: "Latitude", valueType: { type: "number" } },
          {
            id: "longitude",
            label: "Longitude",
            valueType: { type: "number" },
          },
          {
            id: "quantumDegrees",
            label: "Quantum Degrees",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biomonitoringRecordLocationPrecisionMaskTool.execute;
export default biomonitoringRecordLocationPrecisionMaskTool;
