import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ codepoint: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "codepoint", label: "Codepoint", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.scalar(i.codepoint);
  return H.finish({ escape: "\\u{" + H.hex(i.codepoint, 1) + "}" });
};
export const example = {
  input: { codepoint: 128512 },
  output: { result: { escape: "\\u{1F600}" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "encode/unicode-code-point-js-escape",
  title: "Encoding: Unicode Code Point Js Escape Tool",
  description:
    "Encode one Unicode scalar as an uppercase ECMAScript braced Unicode code-point escape, independent of legacy UTF-16 surrogate escape pairs.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { escape: { type: "string" } },
        required: ["escape"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
