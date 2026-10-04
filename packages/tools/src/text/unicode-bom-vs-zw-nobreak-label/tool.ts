import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ codepoint: number; atStreamStart: boolean }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "codepoint", label: "Codepoint", kind: "integer" },
  { id: "atStreamStart", label: "At stream start", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.scalar(i.codepoint);
  return H.finish({
    isFEFF: i.codepoint === 0xfeff,
    interpretation:
      i.codepoint !== 0xfeff
        ? "other-codepoint"
        : i.atStreamStart
          ? "possible-byte-order-mark"
          : "zero-width-no-break-space-legacy",
  });
};
export const example = {
  input: { codepoint: 65279, atStreamStart: true },
  output: {
    result: { isFEFF: true, interpretation: "possible-byte-order-mark" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/unicode-bom-vs-zw-nobreak-label",
  title: "Text: Unicode Bom Vs Zw Nobreak Label Tool",
  description:
    "Distinguish positional interpretations of Unicode FEFF without claiming a decoded scalar proves a byte-level BOM; internal FEFF is a legacy ZWNBSP use.",
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
          interpretation: { type: "string" },
          isFEFF: { type: "boolean" },
        },
        required: ["interpretation", "isFEFF"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
