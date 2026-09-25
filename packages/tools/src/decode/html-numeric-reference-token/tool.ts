import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "Token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^&#(?:[0-9]{1,8}|[xX][0-9A-Fa-f]{1,6});(?![\s\S])/.test(i.token));
  const hex = /^&#[xX]/.test(i.token),
    n = parseInt(i.token.slice(hex ? 3 : 2, -1), hex ? 16 : 10),
    valid = n <= 0x10ffff && (n < 0xd800 || n > 0xdfff);
  return H.finish({
    radix: hex ? 16 : 10,
    codepoint: n,
    validUnicodeScalar: valid,
  });
};
export const example = {
  input: { token: "&#xD800;" },
  output: {
    result: { radix: 16, codepoint: 55296, validUnicodeScalar: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/html-numeric-reference-token",
  title: "Decoding: Html Numeric Reference Token Tool",
  description:
    "Parse one terminated numeric character reference, retaining radix and invalid-Unicode-scalar evidence; no HTML replacement table or document parsing.",
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
          codepoint: { type: "number" },
          radix: { type: "number" },
          validUnicodeScalar: { type: "boolean" },
        },
        required: ["codepoint", "radix", "validUnicodeScalar"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
