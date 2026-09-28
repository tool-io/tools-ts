import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly polygonJson: string };
export type Output = { readonly geometryJson: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { polygonJson: { type: "string", maxLength: 8192 } },
  required: ["polygonJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { geometryJson: { type: "string", maxLength: 8192 } },
  required: ["geometryJson"],
} as const;
/** Structurally wrap supplied Polygon coordinates; this does not revalidate every nested ring. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { polygonJson } = request;
  const compute = (): Output => {
    const p = H.plain(H.parseJson(polygonJson));
    H.domain(p.type === "Polygon" && Array.isArray(p.coordinates));
    return {
      geometryJson: JSON.stringify({
        type: "MultiPolygon",
        coordinates: [p.coordinates],
      }),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    polygonJson: '{"type":"Polygon","coordinates":[[[0,0],[1,0],[0,1],[0,0]]]}',
  },
  output: {
    geometryJson:
      '{"type":"MultiPolygon","coordinates":[[[[0,0],[1,0],[0,1],[0,0]]]]}',
  },
} satisfies ToolExample<Input, Output>;
export const polygonToMultipolygonSingletonWrapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/polygon-to-multipolygon-singleton-wrap",
    title: "Polygon To Multipolygon Singleton Wrap Tool",
    description:
      "Structurally wrap supplied Polygon coordinates; this does not revalidate every nested ring.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { polygonJson: { type: "string", maxLength: 8192 } },
      required: ["polygonJson"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { geometryJson: { type: "string", maxLength: 8192 } },
      required: ["geometryJson"],
    },
    ports: {
      inputs: [
        {
          id: "polygonJson",
          label: "Polygon Json",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "geometryJson",
          label: "Geometry Json",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = polygonToMultipolygonSingletonWrapTool.execute;
export default polygonToMultipolygonSingletonWrapTool;
