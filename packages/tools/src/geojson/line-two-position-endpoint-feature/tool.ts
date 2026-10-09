import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly featureId: string;
  readonly startPosition: readonly number[];
  readonly endPosition: readonly number[];
};
export type Output = { readonly featureJson: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    featureId: { type: "string", maxLength: 8192 },
    startPosition: { type: "array", maxItems: 256, items: { type: "number" } },
    endPosition: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["featureId", "startPosition", "endPosition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { featureJson: { type: "string", maxLength: 8192 } },
  required: ["featureJson"],
} as const;
/** Serialize a two-position GeoJSON LineString Feature from explicit longitude-latitude and optional height positions without projecting coordinates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { featureId, startPosition, endPosition } = request;
  const compute = (): Output => {
    H.domain(
      startPosition.length >= 2 && startPosition.length <= 3,
      "startPosition",
    );
    H.domain(endPosition.length === startPosition.length, "endPosition");
    return {
      featureJson: JSON.stringify({
        type: "Feature",
        id: featureId,
        geometry: {
          type: "LineString",
          coordinates: [startPosition, endPosition],
        },
        properties: {},
      }),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { featureId: "F17", startPosition: [1, 2], endPosition: [3, 4] },
  output: {
    featureJson:
      '{"type":"Feature","id":"F17","geometry":{"type":"LineString","coordinates":[[1,2],[3,4]]},"properties":{}}',
  },
} satisfies ToolExample<Input, Output>;
export const lineTwoPositionEndpointFeatureTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["geojson", "computer science"],
      keywords: ["GeoJSON", "computer science"],
    },
    id: "geojson/line-two-position-endpoint-feature",
    title: "Line Two Position Endpoint Feature",
    description:
      "Serialize a two-position GeoJSON LineString Feature from explicit longitude-latitude and optional height positions without projecting coordinates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        featureId: { type: "string", maxLength: 8192 },
        startPosition: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        endPosition: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["featureId", "startPosition", "endPosition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { featureJson: { type: "string", maxLength: 8192 } },
      required: ["featureJson"],
    },
    ports: {
      inputs: [
        {
          id: "featureId",
          label: "Feature Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "startPosition",
          label: "Start Position",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "endPosition",
          label: "End Position",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "featureJson",
          label: "Feature Json",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = lineTwoPositionEndpointFeatureTool.execute;
export default lineTwoPositionEndpointFeatureTool;
