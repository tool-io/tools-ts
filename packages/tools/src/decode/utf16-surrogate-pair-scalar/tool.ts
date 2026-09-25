import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ highSurrogate: number; lowSurrogate: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "highSurrogate", label: "High surrogate", kind: "integer" },
  { id: "lowSurrogate", label: "Low surrogate", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.highSurrogate, 0xd800, 0xdbff);
  H.int(i.lowSurrogate, 0xdc00, 0xdfff);
  return H.finish({
    codepoint:
      65536 + (i.highSurrogate - 55296) * 1024 + i.lowSurrogate - 56320,
  });
};
export const example = {
  input: { highSurrogate: 55357, lowSurrogate: 56832 },
  output: { result: { codepoint: 128512 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/utf16-surrogate-pair-scalar",
  title: "Decoding: Utf16 Surrogate Pair Scalar Tool",
  description:
    "Decode one validated UTF-16 surrogate pair to its Unicode scalar, rejecting isolated or reversed halves.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { codepoint: { type: "number" } },
        required: ["codepoint"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
