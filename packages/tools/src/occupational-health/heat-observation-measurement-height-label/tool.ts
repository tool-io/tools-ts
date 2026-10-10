import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly heightMeters: number;
  readonly locationWording: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    heightMeters: { type: "number", minimum: 0 },
    locationWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "heightMeters", "locationWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit environmental-heat observation height without selecting a monitoring height or heat-stress method. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, heightMeters, locationWording } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0 && locationWording.length > 0, "recordId");
    H.domain(heightMeters >= 0, "heightMeters");
    return {
      label:
        recordId + "; height=" + heightMeters + " m [" + locationWording + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "H17", heightMeters: 1.1, locationWording: "station A" },
  output: { label: "H17; height=1.1 m [station A]" },
} satisfies ToolExample<Input, Output>;
export const heatObservationMeasurementHeightLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: [
          "occupational-health",
          "occupational health",
          "health and medicine",
        ],
        keywords: ["occupational health", "health and medicine"],
      },
      id: "occupational-health/heat-observation-measurement-height-label",
      title: "Heat Observation Measurement Height Label",
      description:
        "Label an explicit environmental-heat observation height without selecting a monitoring height or heat-stress method.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          heightMeters: { type: "number", minimum: 0 },
          locationWording: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "heightMeters", "locationWording"],
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
            id: "recordId",
            label: "Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "heightMeters",
            label: "Height Meters",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "locationWording",
            label: "Location Wording",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = heatObservationMeasurementHeightLabelTool.execute;
export default heatObservationMeasurementHeightLabelTool;
