import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ glyphsJson: string; shift: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "glyphsJson", label: "glyphsJson", kind: "string" },
  { id: "shift", label: "shift", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const g = H.glyphPlaced(i.glyphsJson);
  return H.finish({
    glyphs: g.map(({ x, ...v }) => ({
      ...v,
      box: v.box
        ? [v.box[0], v.box[1] + i.shift, v.box[2], v.box[3] + i.shift]
        : null,
    })),
  });
};
export const example = {
  input: {
    glyphsJson:
      '[{"id": "a", "advance": 4, "cluster": 0, "box": [0, -1, 3, 2]}, {"id": "b", "advance": 5, "cluster": 1, "box": null}]',
    shift: 2,
  },
  output: {
    result: {
      glyphs: [
        { id: "a", advance: 4, cluster: 0, box: [0, 1, 3, 4] },
        { id: "b", advance: 5, cluster: 1, box: null },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Glyph Baseline Shift Transform", "typography", "Unicode"],
    collections: ["data", "learn"],
    fields: ["glyph", "typography", "Unicode"],
    keywords: ["typography", "Unicode"],
  },
  id: "glyph/glyph-baseline-shift-transform",
  title: "Glyph Baseline Shift Transform",
  description:
    "Shift known glyph ink boxes vertically by an explicit baseline offset while preserving advances and missing-box evidence; no font-size or shaping changes.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          glyphs: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                id: { type: "string" },
                advance: { type: "number" },
                cluster: { type: "number" },
                box: {
                  anyOf: [
                    { type: "array", items: { type: "number" } },
                    { type: "null" },
                  ],
                },
              },
              required: ["id", "advance", "cluster", "box"],
            },
          },
        },
        required: ["glyphs"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
