import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ glyphsJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "glyphsJson", label: "glyphsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const g = H.glyphPlaced(i.glyphsJson);
  return H.finish({
    indexes: g.flatMap((v, j) => (v.box === null ? [j] : [])),
  });
};
export const example = {
  input: {
    glyphsJson:
      '[{"id": "a", "advance": 4, "cluster": 0, "box": [0, -1, 3, 2]}, {"id": "b", "advance": 5, "cluster": 1, "box": null}]',
  },
  output: { result: { indexes: [1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Glyph Missing Box Audit", "typography", "Unicode"],
    collections: ["data", "learn"],
    fields: ["glyph", "typography", "Unicode"],
    keywords: ["typography", "Unicode"],
  },
  id: "glyph/glyph-missing-box-audit",
  title: "Glyph Missing Box Audit",
  description:
    "Identify supplied glyph records with explicitly unknown ink boxes; absence is not assumed to be an empty-space glyph.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { indexes: { type: "array", items: { type: "number" } } },
        required: ["indexes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
