import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly childJson: string };
export type Output = { readonly type: string; readonly recognized: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { childJson: { type: "string", maxLength: 8192 } },
  required: ["childJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    type: { type: "string", maxLength: 8192 },
    recognized: { type: "boolean" },
  },
  required: ["type", "recognized"],
} as const;
/** Calculate geometry collection child type token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { childJson } = request;
  const compute = (): Output => {
    const c = H.plain(H.parseJson(childJson));
    const type = typeof c.type === "string" ? c.type : "";
    return {
      type,
      recognized: [
        "Point",
        "MultiPoint",
        "LineString",
        "MultiLineString",
        "Polygon",
        "MultiPolygon",
        "GeometryCollection",
      ].includes(type),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { childJson: '{"type":"Point","coordinates":[1,2]}' },
  output: { type: "Point", recognized: true },
} satisfies ToolExample<Input, Output>;
export const geometryCollectionChildTypeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/geometry-collection-child-type-token",
    title: "Geometry Collection Child Type Token Tool",
    description:
      "Calculate geometry collection child type token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { childJson: { type: "string", maxLength: 8192 } },
      required: ["childJson"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        type: { type: "string", maxLength: 8192 },
        recognized: { type: "boolean" },
      },
      required: ["type", "recognized"],
    },
    ports: {
      inputs: [
        {
          id: "childJson",
          label: "Child Json",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "type", label: "Type", valueType: { type: "string" } },
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = geometryCollectionChildTypeTokenTool.execute;
export default geometryCollectionChildTypeTokenTool;
