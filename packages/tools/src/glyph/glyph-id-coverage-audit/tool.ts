import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  glyphsJson: string;
  available: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "glyphsJson", label: "glyphsJson", kind: "string" },
  { id: "available", label: "available", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const g = H.glyphPlaced(i.glyphsJson);
  return H.finish({
    missing: g.flatMap((v, index) =>
      i.available.includes(v.id) ? [] : [{ index, id: v.id }],
    ),
  });
};
export const example = {
  input: {
    glyphsJson:
      '[{"id": "a", "advance": 4, "cluster": 0, "box": [0, -1, 3, 2]}, {"id": "b", "advance": 5, "cluster": 1, "box": null}]',
    available: ["a"],
  },
  output: { result: { missing: [{ index: 1, id: "b" }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Glyph ID Coverage Audit", "typography", "Unicode"],
    collections: ["data", "learn"],
    fields: ["glyph", "typography", "Unicode"],
    keywords: ["typography", "Unicode"],
  },
  id: "glyph/glyph-id-coverage-audit",
  title: "Glyph ID Coverage Audit",
  description:
    "Audit observed glyph metric IDs against an explicit font inventory, preserving occurrence indexes and missing metrics; no font-file lookup or fallback shaping.",
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
          missing: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: { index: { type: "number" }, id: { type: "string" } },
              required: ["index", "id"],
            },
          },
        },
        required: ["missing"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
