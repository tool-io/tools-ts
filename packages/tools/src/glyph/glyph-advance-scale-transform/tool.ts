import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ glyphsJson: string; scale: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "glyphsJson", label: "glyphsJson", kind: "string" },
  { id: "scale", label: "scale", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const g = H.glyphPlaced(i.glyphsJson);
  H.check(i.scale >= 0);
  return H.finish({
    glyphs: g.map(({ x, ...v }) => ({
      ...v,
      advance: v.advance * i.scale,
      box: v.box?.map((x) => x * i.scale) ?? null,
    })),
  });
};
export const example = {
  input: {
    glyphsJson:
      '[{"id": "a", "advance": 4, "cluster": 0, "box": [0, -1, 3, 2]}, {"id": "b", "advance": 5, "cluster": 1, "box": null}]',
    scale: 2,
  },
  output: {
    result: {
      glyphs: [
        { id: "a", advance: 8, cluster: 0, box: [0, -2, 6, 4] },
        { id: "b", advance: 10, cluster: 1, box: null },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glyph/glyph-advance-scale-transform",
  title: "Glyph Advance Scale Transform",
  description:
    "Scale explicit glyph advances and known box coordinates by a nonnegative uniform factor; no hinted rasterization or font metric inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
