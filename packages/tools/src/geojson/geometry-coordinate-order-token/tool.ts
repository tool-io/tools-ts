import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly recordId: string; readonly axisOrder: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    axisOrder: {
      type: "string",
      maxLength: 8192,
      enum: ["longitude-latitude", "latitude-longitude"],
    },
  },
  required: ["recordId", "axisOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied coordinate record axis order; RFC 7946 GeoJSON positions require longitude before latitude. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, axisOrder } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      ["longitude-latitude", "latitude-longitude"].includes(axisOrder),
      "axisOrder",
    );
    return { label: recordId + " [" + axisOrder + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", axisOrder: "longitude-latitude" },
  output: { label: "R17 [longitude-latitude]" },
} satisfies ToolExample<Input, Output>;
export const geometryCoordinateOrderTokenTool = H.defineSchemaCalculation<
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
    id: "geojson/geometry-coordinate-order-token",
    title: "Geometry Coordinate Order Token",
    description:
      "Label a supplied coordinate record axis order; RFC 7946 GeoJSON positions require longitude before latitude.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        axisOrder: {
          type: "string",
          maxLength: 8192,
          enum: ["longitude-latitude", "latitude-longitude"],
        },
      },
      required: ["recordId", "axisOrder"],
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
          id: "axisOrder",
          label: "Axis Order",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = geometryCoordinateOrderTokenTool.execute;
export default geometryCoordinateOrderTokenTool;
