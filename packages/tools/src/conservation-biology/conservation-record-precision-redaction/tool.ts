import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly latitude: number;
  readonly longitude: number;
  readonly publicDecimalPlaces: number;
};
export type Output = {
  readonly publicLatitude: number;
  readonly publicLongitude: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latitude: { type: "number", minimum: -90, maximum: 90 },
    longitude: { type: "number", minimum: -180, maximum: 180 },
    publicDecimalPlaces: { type: "integer", minimum: 0, maximum: 6 },
  },
  required: ["latitude", "longitude", "publicDecimalPlaces"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    publicLatitude: { type: "number" },
    publicLongitude: { type: "number" },
  },
  required: ["publicLatitude", "publicLongitude"],
} as const;
/** Truncate explicit public-record coordinates toward zero to a supplied decimal precision; this reduces precision but does not guarantee location confidentiality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { latitude, longitude, publicDecimalPlaces } = request;
  const compute = (): Output => {
    H.domain(
      latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180,
      "latitude",
    );
    (H.domain(
      Number.isSafeInteger(publicDecimalPlaces) &&
        publicDecimalPlaces >= 0 &&
        publicDecimalPlaces <= 6,
      "publicDecimalPlaces",
    ),
      publicDecimalPlaces);
    const factor = 10 ** publicDecimalPlaces;
    return {
      publicLatitude: Math.trunc(latitude * factor) / factor,
      publicLongitude: Math.trunc(longitude * factor) / factor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { latitude: 12.34567, longitude: -45.67891, publicDecimalPlaces: 2 },
  output: { publicLatitude: 12.34, publicLongitude: -45.67 },
} satisfies ToolExample<Input, Output>;
export const conservationRecordPrecisionRedactionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["conservation-biology", "conservation biology", "biology"],
        keywords: ["conservation biology", "biology"],
      },
      id: "conservation-biology/conservation-record-precision-redaction",
      title: "Conservation Record Precision Redaction",
      description:
        "Truncate explicit public-record coordinates toward zero to a supplied decimal precision; this reduces precision but does not guarantee location confidentiality.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          latitude: { type: "number", minimum: -90, maximum: 90 },
          longitude: { type: "number", minimum: -180, maximum: 180 },
          publicDecimalPlaces: { type: "integer", minimum: 0, maximum: 6 },
        },
        required: ["latitude", "longitude", "publicDecimalPlaces"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          publicLatitude: { type: "number" },
          publicLongitude: { type: "number" },
        },
        required: ["publicLatitude", "publicLongitude"],
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
            id: "publicDecimalPlaces",
            label: "Public Decimal Places",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "publicLatitude",
            label: "Public Latitude",
            valueType: { type: "number" },
          },
          {
            id: "publicLongitude",
            label: "Public Longitude",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = conservationRecordPrecisionRedactionTool.execute;
export default conservationRecordPrecisionRedactionTool;
