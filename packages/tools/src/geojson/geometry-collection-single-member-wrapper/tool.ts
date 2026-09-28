import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  parseJson,
  plain,
  text,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly geometryJson: string };
export type Output = { readonly collectionJson: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { geometryJson: { type: "string", maxLength: 8192 } },
  required: ["geometryJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { collectionJson: { type: "string", maxLength: 8192 } },
  required: ["collectionJson"],
} as const;
/** Compute geometry collection single member wrapper from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { geometryJson } = input;
  const compute = (): Output => {
    const g = plain(parseJson(geometryJson));
    domain(
      [
        "Point",
        "MultiPoint",
        "LineString",
        "MultiLineString",
        "Polygon",
        "MultiPolygon",
        "GeometryCollection",
      ].includes(text(g.type)),
    );
    return {
      collectionJson: JSON.stringify({
        type: "GeometryCollection",
        geometries: [g],
      }),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { geometryJson: '{"type":"Point","coordinates":[1,2]}' },
  output: {
    collectionJson:
      '{"type":"GeometryCollection","geometries":[{"type":"Point","coordinates":[1,2]}]}',
  },
} satisfies ToolExample<Input, Output>;
export const geometryCollectionSingleMemberWrapperTool =
  defineSchemaCalculation<Input, Output>({
    id: "geojson/geometry-collection-single-member-wrapper",
    title: "Geometry Collection Single Member Wrapper Tool",
    description:
      "Compute geometry collection single member wrapper from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
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
          id: "collectionJson",
          label: "Collection Json",
          valueType: { type: "string" },
        },
      ],
    },
  });
export const run = geometryCollectionSingleMemberWrapperTool.execute;
export default geometryCollectionSingleMemberWrapperTool;
