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
  const advance = g.reduce((s, v) => s + v.advance, 0),
    boxes = g.flatMap((v) => (v.box ? [[v.x + v.box[0], v.x + v.box[2]]] : []));
  return H.finish({
    advance,
    leading: boxes.length
      ? Math.max(0, -Math.min(...boxes.map((v) => v[0])))
      : null,
    trailing: boxes.length
      ? Math.max(0, Math.max(...boxes.map((v) => v[1])) - advance)
      : null,
  });
};
export const example = {
  input: {
    glyphsJson:
      '[{"id": "a", "advance": 4, "cluster": 0, "box": [0, -1, 3, 2]}, {"id": "b", "advance": 5, "cluster": 1, "box": null}]',
  },
  output: { result: { advance: 9, leading: 0, trailing: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glyph/glyph-overhang-budget",
  title: "Glyph Overhang Budget",
  description:
    "Budget horizontal ink overhang outside the explicit advance run, using null when no ink boxes are known; no font rendering. ",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
