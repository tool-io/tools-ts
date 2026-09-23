import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ word: string; width: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "word", label: "Word", kind: "string" },
  { id: "width", label: "Width", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const x = H.word(i.word, i.width),
    sign = 2n ** BigInt(i.width - 1);
  return H.finish({
    unsigned: String(x),
    twosComplementSigned: String(x >= sign ? x - 2n * sign : x),
  });
};
export const example = {
  input: { word: "255", width: 8 },
  output: { result: { unsigned: "255", twosComplementSigned: "-1" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/word-signedness-reinterpretation",
  title: "Bitwise: Word Signedness Reinterpretation Tool",
  description:
    "Reinterpret one exact unsigned bit pattern as unsigned and twos-complement signed decimal, preserving declared width.",
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
          twosComplementSigned: { type: "string" },
          unsigned: { type: "string" },
        },
        required: ["twosComplementSigned", "unsigned"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
