import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly geometryJson: string };
export type Output = {
  readonly nullGeometry: boolean;
  readonly emptyContainer: boolean;
  readonly kind: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { geometryJson: { type: "string", maxLength: 8192 } },
  required: ["geometryJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nullGeometry: { type: "boolean" },
    emptyContainer: { type: "boolean" },
    kind: { type: "string", maxLength: 8192 },
  },
  required: ["nullGeometry", "emptyContainer", "kind"],
} as const;
/** Distinguish null geometry from an empty declared geometry container; not a full GeoJSON topology validator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { geometryJson } = request;
  const compute = (): Output => {
    const value = H.parseJson(geometryJson);
    if (value === null)
      return { nullGeometry: true, emptyContainer: false, kind: "null" };
    const g = H.plain(value),
      kind = H.text(g.type);
    H.domain(
      [
        "Point",
        "MultiPoint",
        "LineString",
        "MultiLineString",
        "Polygon",
        "MultiPolygon",
        "GeometryCollection",
      ].includes(kind),
    );
    const container = H.list(
      kind === "GeometryCollection" ? g.geometries : g.coordinates,
    );
    return {
      nullGeometry: false,
      emptyContainer: container.length === 0,
      kind,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { geometryJson: "null" },
  output: { nullGeometry: true, emptyContainer: false, kind: "null" },
} satisfies ToolExample<Input, Output>;
export const geometryNullVersusEmptyLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/geometry-null-versus-empty-label",
    title: "Geometry Null Versus Empty Label Tool",
    description:
      "Distinguish null geometry from an empty declared geometry container; not a full GeoJSON topology validator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { geometryJson: { type: "string", maxLength: 8192 } },
      required: ["geometryJson"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nullGeometry: { type: "boolean" },
        emptyContainer: { type: "boolean" },
        kind: { type: "string", maxLength: 8192 },
      },
      required: ["nullGeometry", "emptyContainer", "kind"],
    },
    ports: {
      inputs: [
        {
          id: "geometryJson",
          label: "Geometry Json",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "nullGeometry",
          label: "Null Geometry",
          valueType: { type: "boolean" },
        },
        {
          id: "emptyContainer",
          label: "Empty Container",
          valueType: { type: "boolean" },
        },
        { id: "kind", label: "Kind", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = geometryNullVersusEmptyLabelTool.execute;
export default geometryNullVersusEmptyLabelTool;
