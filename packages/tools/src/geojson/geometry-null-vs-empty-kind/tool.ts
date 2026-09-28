import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ geometryJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "geometryJson", label: "Geometry json", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const g = H.json(i.geometryJson);
  let empty = false;
  if (g !== null) {
    const o = H.rec(g);
    H.check(typeof o.type === "string" && o.type !== "GeometryCollection");
    empty = H.array(o.coordinates).length === 0;
  }
  return H.finish({
    kind:
      g === null
        ? "null-geometry"
        : empty
          ? "empty-coordinates"
          : "nonempty-coordinates",
  });
};
export const example = {
  input: { geometryJson: "null" },
  output: { result: { kind: "null-geometry" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geojson/geometry-null-vs-empty-kind",
  title: "GeoJSON: Geometry Null Vs Empty Kind Tool",
  description:
    "Distinguish explicit null geometry from an immediate empty coordinate array in a supplied geometry object; does not validate topology or full FeatureCollections.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { kind: { type: "string" } },
        required: ["kind"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
