import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ codepoint: number; radix: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "codepoint", label: "Codepoint", kind: "integer" },
  { id: "radix", label: "Radix", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.scalar(i.codepoint);
  H.check(i.radix === 10 || i.radix === 16);
  return H.finish({
    reference:
      i.radix === 16
        ? "&#x" + H.hex(i.codepoint, 1) + ";"
        : "&#" + i.codepoint + ";",
  });
};
export const example = {
  input: { codepoint: 65, radix: 16 },
  output: { result: { reference: "&#x41;" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "encode/html-numeric-reference-scalar",
  title: "Encoding: Html Numeric Reference Scalar Tool",
  description:
    "Format one validated Unicode scalar as a terminated decimal or hexadecimal numeric character reference; no document escaping or HTML replacement policy.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reference: { type: "string" } },
        required: ["reference"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
