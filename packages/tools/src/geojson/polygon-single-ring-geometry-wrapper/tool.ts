import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly ring: readonly (readonly number[])[] };
export type Output = { readonly geometryJson: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ring: {
      type: "array",
      maxItems: 128,
      items: { type: "array", maxItems: 128, items: { type: "number" } },
    },
  },
  required: ["ring"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { geometryJson: { type: "string", maxLength: 8192 } },
  required: ["geometryJson"],
} as const;
/** Calculate polygon single ring geometry wrapper from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ring } = request;
  const compute = (): Output => {
    H.domain(
      ring.length >= 4 && ring.every((x) => x.length === 2 || x.length === 3),
    );
    const first = ring[0],
      last = ring[ring.length - 1];
    H.domain(
      first.length === last.length &&
        first.every((x, i) => x === last[i]) &&
        ring.every((x) => x.length === first.length),
    );
    return {
      geometryJson: JSON.stringify({ type: "Polygon", coordinates: [ring] }),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    ring: [
      [0, 0],
      [2, 0],
      [0, 2],
      [0, 0],
    ],
  },
  output: {
    geometryJson:
      '{"type":"Polygon","coordinates":[[[0,0],[2,0],[0,2],[0,0]]]}',
  },
} satisfies ToolExample<Input, Output>;
export const polygonSingleRingGeometryWrapperTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/polygon-single-ring-geometry-wrapper",
    title: "Polygon Single Ring Geometry Wrapper Tool",
    description:
      "Calculate polygon single ring geometry wrapper from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ring: {
          type: "array",
          maxItems: 128,
          items: { type: "array", maxItems: 128, items: { type: "number" } },
        },
      },
      required: ["ring"],
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
          id: "ring",
          label: "Ring",
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
export const run = polygonSingleRingGeometryWrapperTool.execute;
export default polygonSingleRingGeometryWrapperTool;
