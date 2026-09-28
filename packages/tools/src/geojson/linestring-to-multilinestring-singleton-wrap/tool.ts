import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly coordinates: readonly (readonly number[])[] };
export type Output = { readonly geometryJson: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinates: {
      type: "array",
      maxItems: 128,
      items: { type: "array", maxItems: 128, items: { type: "number" } },
    },
  },
  required: ["coordinates"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { geometryJson: { type: "string", maxLength: 8192 } },
  required: ["geometryJson"],
} as const;
/** Calculate linestring to multilinestring singleton wrap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinates } = request;
  const compute = (): Output => {
    H.domain(
      coordinates.length >= 2 && coordinates.every((p) => p.length >= 2),
    );
    return {
      geometryJson: JSON.stringify({
        type: "MultiLineString",
        coordinates: [coordinates],
      }),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    coordinates: [
      [1, 2],
      [3, 4],
    ],
  },
  output: {
    geometryJson: '{"type":"MultiLineString","coordinates":[[[1,2],[3,4]]]}',
  },
} satisfies ToolExample<Input, Output>;
export const linestringToMultilinestringSingletonWrapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geojson/linestring-to-multilinestring-singleton-wrap",
      title: "Linestring To Multilinestring Singleton Wrap Tool",
      description:
        "Calculate linestring to multilinestring singleton wrap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coordinates: {
            type: "array",
            maxItems: 128,
            items: { type: "array", maxItems: 128, items: { type: "number" } },
          },
        },
        required: ["coordinates"],
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
            id: "coordinates",
            label: "Coordinates",
            required: true,
            valueType: {
              type: "list",
              items: { type: "list", items: { type: "number" } },
            },
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
export const run = linestringToMultilinestringSingletonWrapTool.execute;
export default linestringToMultilinestringSingletonWrapTool;
