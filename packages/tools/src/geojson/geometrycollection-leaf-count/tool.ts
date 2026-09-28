import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly geometryJson: string };
export type Output = {
  readonly leafCount: number;
  readonly collectionCount: number;
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
    leafCount: { type: "integer" },
    collectionCount: { type: "integer" },
  },
  required: ["leafCount", "collectionCount"],
} as const;
/** Count declared noncollection geometry leaves and collection containers; coordinate/topology validation is separate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { geometryJson } = request;
  const compute = (): Output => {
    const root = H.plain(H.parseJson(geometryJson));
    H.domain(root.type === "GeometryCollection");
    let leafCount = 0,
      collectionCount = 0;
    const walk = (v: unknown, depth: number): void => {
      H.domain(depth <= 32);
      const g = H.plain(v),
        kind = H.text(g.type);
      if (kind === "GeometryCollection") {
        collectionCount++;
        H.list(g.geometries).forEach((x) => walk(x, depth + 1));
      } else {
        H.domain(
          [
            "Point",
            "MultiPoint",
            "LineString",
            "MultiLineString",
            "Polygon",
            "MultiPolygon",
          ].includes(kind),
        );
        leafCount++;
      }
    };
    walk(root, 0);
    return { leafCount, collectionCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    geometryJson:
      '{"type":"GeometryCollection","geometries":[{"type":"Point","coordinates":[0,0]},{"type":"GeometryCollection","geometries":[{"type":"LineString","coordinates":[[0,0],[1,1]]}]}]}',
  },
  output: { leafCount: 2, collectionCount: 2 },
} satisfies ToolExample<Input, Output>;
export const geometrycollectionLeafCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/geometrycollection-leaf-count",
    title: "Geometrycollection Leaf Count Tool",
    description:
      "Count declared noncollection geometry leaves and collection containers; coordinate/topology validation is separate.",
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
        leafCount: { type: "integer" },
        collectionCount: { type: "integer" },
      },
      required: ["leafCount", "collectionCount"],
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
          id: "leafCount",
          label: "Leaf Count",
          valueType: { type: "integer" },
        },
        {
          id: "collectionCount",
          label: "Collection Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = geometrycollectionLeafCountTool.execute;
export default geometrycollectionLeafCountTool;
