import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly type: string };
export type Output = { readonly depth: number; readonly collection: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    type: {
      type: "string",
      maxLength: 8192,
      enum: [
        "Point",
        "MultiPoint",
        "LineString",
        "MultiLineString",
        "Polygon",
        "MultiPolygon",
        "GeometryCollection",
      ],
    },
  },
  required: ["type"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { depth: { type: "integer" }, collection: { type: "boolean" } },
  required: ["depth", "collection"],
} as const;
/** Calculate geometry type coordinate depth record from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { type } = request;
  const compute = (): Output => {
    H.domain(
      [
        "Point",
        "MultiPoint",
        "LineString",
        "MultiLineString",
        "Polygon",
        "MultiPolygon",
        "GeometryCollection",
      ].includes(type),
    );
    return {
      depth:
        type === "Point"
          ? 1
          : type === "MultiPoint" || type === "LineString"
            ? 2
            : type === "Polygon" || type === "MultiLineString"
              ? 3
              : type === "MultiPolygon"
                ? 4
                : 0,
      collection: type === "GeometryCollection",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { type: "MultiPolygon" },
  output: { depth: 4, collection: false },
} satisfies ToolExample<Input, Output>;
export const geometryTypeCoordinateDepthRecordTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/geometry-type-coordinate-depth-record",
    title: "Geometry Type Coordinate Depth Record Tool",
    description:
      "Calculate geometry type coordinate depth record from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        type: {
          type: "string",
          maxLength: 8192,
          enum: [
            "Point",
            "MultiPoint",
            "LineString",
            "MultiLineString",
            "Polygon",
            "MultiPolygon",
            "GeometryCollection",
          ],
        },
      },
      required: ["type"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depth: { type: "integer" },
        collection: { type: "boolean" },
      },
      required: ["depth", "collection"],
    },
    ports: {
      inputs: [
        {
          id: "type",
          label: "Type",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "depth", label: "Depth", valueType: { type: "integer" } },
        {
          id: "collection",
          label: "Collection",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = geometryTypeCoordinateDepthRecordTool.execute;
export default geometryTypeCoordinateDepthRecordTool;
