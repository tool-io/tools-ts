import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ glyphsJson: string; tolerance: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "glyphsJson", label: "glyphsJson", kind: "string" },
  { id: "tolerance", label: "tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const g = H.glyphPlaced(i.glyphsJson);
  H.check(i.tolerance >= 0);
  return H.finish({
    consistent: g.length
      ? Math.max(...g.map((v) => v.advance)) -
          Math.min(...g.map((v) => v.advance)) <=
        i.tolerance
      : true,
    spread: g.length
      ? Math.max(...g.map((v) => v.advance)) -
        Math.min(...g.map((v) => v.advance))
      : null,
  });
};
export const example = {
  input: {
    glyphsJson:
      '[{"id": "a", "advance": 4, "cluster": 0, "box": [0, -1, 3, 2]}, {"id": "b", "advance": 5, "cluster": 1, "box": null}]',
    tolerance: 0,
  },
  output: { result: { consistent: false, spread: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Glyph Tabular Advance Consistency", "typography", "Unicode"],
    collections: ["data", "learn"],
    fields: ["glyph", "typography", "Unicode"],
    keywords: ["typography", "Unicode"],
  },
  id: "glyph/glyph-tabular-advance-consistency",
  title: "Glyph Tabular Advance Consistency",
  description:
    "Check supplied glyph advances for tabular consistency within an explicit nonnegative absolute tolerance; does not certify a font feature or digit repertoire.",
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
          consistent: { type: "boolean" },
          spread: { anyOf: [{ type: "number" }, { type: "null" }] },
        },
        required: ["consistent", "spread"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
