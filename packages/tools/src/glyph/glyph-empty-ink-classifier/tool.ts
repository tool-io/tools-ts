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
  return H.finish({
    classes: g.map((v) =>
      v.box === null
        ? "unknown"
        : v.box[0] === v.box[2] || v.box[1] === v.box[3]
          ? "empty"
          : "nonempty",
    ),
  });
};
export const example = {
  input: {
    glyphsJson:
      '[{"id": "a", "advance": 4, "cluster": 0, "box": [0, -1, 3, 2]}, {"id": "b", "advance": 5, "cluster": 1, "box": null}]',
  },
  output: { result: { classes: ["nonempty", "unknown"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glyph/glyph-empty-ink-classifier",
  title: "Glyph Empty Ink Classifier",
  description:
    "Classify supplied glyph boxes as positive-area ink, degenerate empty ink or explicitly unknown; missing is never silently empty.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
