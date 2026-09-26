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
  return H.finish({
    codeUnits:
      i.codepoint < 65536
        ? [i.codepoint]
        : [
            55296 + Math.floor((i.codepoint - 65536) / 1024),
            56320 + ((i.codepoint - 65536) % 1024),
          ],
  });
};
export const example = {
  input: { codepoint: 128512 },
  output: { result: { codeUnits: [55357, 56832] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "encode/utf16-surrogate-pair-codepoint",
  title: "Encoding: Utf16 Surrogate Pair Codepoint Tool",
  description:
    "Encode one Unicode scalar as one BMP UTF-16 unit or an ordered high/low surrogate pair, rejecting surrogate code points.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { codeUnits: { type: "array", items: { type: "number" } } },
        required: ["codeUnits"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
