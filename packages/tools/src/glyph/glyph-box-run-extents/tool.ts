import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ glyphsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "glyphsJson", label: "glyphsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const g = H.glyphPlaced(i.glyphsJson);
  const boxes = g.flatMap((v) =>
    v.box ? [[v.x + v.box[0], v.box[1], v.x + v.box[2], v.box[3]]] : [],
  );
  return H.finish({
    extents: boxes.length
      ? [
          Math.min(...boxes.map((b) => b[0])),
          Math.min(...boxes.map((b) => b[1])),
          Math.max(...boxes.map((b) => b[2])),
          Math.max(...boxes.map((b) => b[3])),
        ]
      : null,
  });
};
export const example = {
  input: {
    glyphsJson:
      '[{"id": "a", "advance": 4, "cluster": 0, "box": [0, -1, 3, 2]}, {"id": "b", "advance": 5, "cluster": 1, "box": null}]',
  },
  output: { result: { extents: [0, -1, 3, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glyph/glyph-box-run-extents",
  title: "Glyph Box Run Extents",
  description:
    "Union explicitly supplied glyph ink boxes placed by accumulated horizontal advances; missing boxes contribute no invented ink, no font shaping. ",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
