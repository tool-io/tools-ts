import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ byteCount: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "byteCount", label: "Byte count", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.byteCount, 0, 1000000000);
  return H.finish({
    padCharacters: [0, 6, 4, 3, 1][i.byteCount % 5],
    encodedLength: 8 * Math.ceil(i.byteCount / 5),
  });
};
export const example = {
  input: { byteCount: 2 },
  output: { result: { padCharacters: 4, encodedLength: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "encode/base32-pad-character-count",
  title: "Encoding: Base32 Pad Character Count Tool",
  description:
    "Compute RFC4648 padded Base32 length and padding count from byte length, independently of the base32/base32hex alphabet.",
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
          encodedLength: { type: "number" },
          padCharacters: { type: "number" },
        },
        required: ["encodedLength", "padCharacters"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
