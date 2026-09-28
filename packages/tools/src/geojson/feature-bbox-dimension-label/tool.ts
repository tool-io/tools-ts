import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ bbox: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bbox", label: "Bbox", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.bbox.length === 4 || i.bbox.length === 6);
  return H.finish({
    dimensions: i.bbox.length / 2,
    label: i.bbox.length === 4 ? "2D" : "3D",
  });
};
export const example = {
  input: { bbox: [0, 0, 1, 1] },
  output: { result: { dimensions: 2, label: "2D" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geojson/feature-bbox-dimension-label",
  title: "GeoJSON: Feature Bbox Dimension Label Tool",
  description:
    "Label a GeoJSON bbox dimensionality from an exact four/six-number shape, not its geographic extent or antimeridian validity.",
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
          dimensions: { type: "number" },
          label: { type: "string" },
        },
        required: ["dimensions", "label"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
