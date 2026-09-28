import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  longitudeDegrees: number;
  latitudeDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "longitudeDegrees",
    label: "Longitude degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "latitudeDegrees",
    label: "Latitude degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.longitudeDegrees, -180, 180);
  H.bounded(i.latitudeDegrees, -90, 90);
  return H.finish({
    type: "Point",
    coordinates: [i.longitudeDegrees, i.latitudeDegrees],
  });
};
export const example = {
  input: { longitudeDegrees: 20, latitudeDegrees: 10 },
  output: { result: { type: "Point", coordinates: [20, 10] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geojson/point-coordinate-pair-builder",
  title: "GeoJSON: Point Coordinate Pair Builder Tool",
  description:
    "Build a two-dimensional RFC7946 Point geometry using longitude-first WGS84 degrees, with explicit range checks and no CRS conversion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coordinates: { type: "array", items: { type: "number" } },
          type: { type: "string" },
        },
        required: ["coordinates", "type"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
