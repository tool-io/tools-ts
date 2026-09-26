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
  const bytes = H.utf8(i.codepoint);
  return H.finish({
    bytes,
    leadingBitLayout: bytes.map((b, j) =>
      j > 0
        ? "10xxxxxx"
        : bytes.length === 1
          ? "0xxxxxxx"
          : bytes.length === 2
            ? "110xxxxx"
            : bytes.length === 3
              ? "1110xxxx"
              : "11110xxx",
    ),
  });
};
export const example = {
  input: { codepoint: 8364 },
  output: {
    result: {
      bytes: [226, 130, 172],
      leadingBitLayout: ["1110xxxx", "10xxxxxx", "10xxxxxx"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "encode/utf8-single-scalar-leading-bit-layout",
  title: "Encoding: UTF-8 Single Scalar Leading Bit Layout Tool",
  description:
    "Return the actual UTF-8 bytes and prefix layout of one scalar using the shared scalar encoder, not a second string encoding implementation.",
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
          bytes: { type: "array", items: { type: "number" } },
          leadingBitLayout: { type: "array", items: { type: "string" } },
        },
        required: ["bytes", "leadingBitLayout"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
