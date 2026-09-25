import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ byte: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "byte", label: "Byte", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.byte, 0, 255);
  return H.finish({
    sequenceLength:
      i.byte <= 127
        ? 1
        : i.byte >= 194 && i.byte <= 223
          ? 2
          : i.byte >= 224 && i.byte <= 239
            ? 3
            : i.byte >= 240 && i.byte <= 244
              ? 4
              : 0,
    validLeadingByte: i.byte <= 127 || (i.byte >= 194 && i.byte <= 244),
  });
};
export const example = {
  input: { byte: 240 },
  output: { result: { sequenceLength: 4, validLeadingByte: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/utf8-leading-byte-sequence-length",
  title: "Decoding: UTF-8 Leading Byte Sequence Length Tool",
  description:
    "Classify one byte as a valid RFC3629 UTF-8 lead byte and its nominal sequence length; continuation/invalid leads return length zero, not full-sequence validity.",
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
          sequenceLength: { type: "number" },
          validLeadingByte: { type: "boolean" },
        },
        required: ["sequenceLength", "validLeadingByte"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
