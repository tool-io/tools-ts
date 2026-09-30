import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    leadingBom: i.text.charCodeAt(0) === 0xfeff,
    contentOffsetUtf16: i.text.charCodeAt(0) === 0xfeff ? 1 : 0,
  });
};
export const example = {
  input: { text: "\ufeff{}" },
  output: { result: { leadingBom: true, contentOffsetUtf16: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-document-bom-offset",
  title: "JSON: JSON Document BOM Offset Tool",
  description:
    "Report a decoded leading FEFF and its UTF-16 offset for JSON preprocessing diagnostics; does not strip, parse or claim RFC8259 producers may emit a BOM.",
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
          contentOffsetUtf16: { type: "number" },
          leadingBom: { type: "boolean" },
        },
        required: ["contentOffsetUtf16", "leadingBom"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
