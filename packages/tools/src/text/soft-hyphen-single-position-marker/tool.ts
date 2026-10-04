import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ text: string; codepointIndex: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "codepointIndex", label: "Codepoint index", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const points = Array.from(i.text);
  H.int(i.codepointIndex, 0, points.length - 1);
  const cp = points[i.codepointIndex].codePointAt(0);
  return H.finish({
    softHyphen: cp === 173,
    markedText: points
      .map((p, j) => (j === i.codepointIndex && cp === 173 ? "[SHY]" : p))
      .join(""),
  });
};
export const example = {
  input: { text: "co\u00adoperate", codepointIndex: 2 },
  output: { result: { softHyphen: true, markedText: "co[SHY]operate" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/soft-hyphen-single-position-marker",
  title: "Text: Soft Hyphen Single Position Marker Tool",
  description:
    "Inspect and visibly replace a soft hyphen at one explicit Unicode-scalar index only, preserving all other text and not inserting visible hyphens generally.",
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
          markedText: { type: "string" },
          softHyphen: { type: "boolean" },
        },
        required: ["markedText", "softHyphen"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
