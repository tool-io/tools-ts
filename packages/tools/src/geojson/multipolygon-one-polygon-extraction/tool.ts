import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly multipolygonJson: string;
  readonly index: number;
};
export type Output = { readonly polygonJson: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    multipolygonJson: { type: "string", maxLength: 8192 },
    index: { type: "integer", minimum: 0 },
  },
  required: ["multipolygonJson", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { polygonJson: { type: "string", maxLength: 8192 } },
  required: ["polygonJson"],
} as const;
/** Extract one coordinate entry as a Polygon without revalidating its nested rings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { multipolygonJson, index } = request;
  const compute = (): Output => {
    const m = H.plain(H.parseJson(multipolygonJson));
    H.domain(m.type === "MultiPolygon");
    const c = H.list(m.coordinates);
    H.integer(index, 0, c.length - 1);
    return {
      polygonJson: JSON.stringify({ type: "Polygon", coordinates: c[index] }),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    multipolygonJson: '{"type":"MultiPolygon","coordinates":[[],[]]}',
    index: 1,
  },
  output: { polygonJson: '{"type":"Polygon","coordinates":[]}' },
} satisfies ToolExample<Input, Output>;
export const multipolygonOnePolygonExtractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/multipolygon-one-polygon-extraction",
    title: "Multipolygon One Polygon Extraction Tool",
    description:
      "Extract one coordinate entry as a Polygon without revalidating its nested rings.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        multipolygonJson: { type: "string", maxLength: 8192 },
        index: { type: "integer", minimum: 0 },
      },
      required: ["multipolygonJson", "index"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { polygonJson: { type: "string", maxLength: 8192 } },
      required: ["polygonJson"],
    },
    ports: {
      inputs: [
        {
          id: "multipolygonJson",
          label: "Multipolygon Json",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "polygonJson",
          label: "Polygon Json",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = multipolygonOnePolygonExtractionTool.execute;
export default multipolygonOnePolygonExtractionTool;
