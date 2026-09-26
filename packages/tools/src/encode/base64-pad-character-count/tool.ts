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
    padCharacters: (3 - (i.byteCount % 3)) % 3,
    encodedLength: 4 * Math.ceil(i.byteCount / 3),
  });
};
export const example = {
  input: { byteCount: 1 },
  output: { result: { padCharacters: 2, encodedLength: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "encode/base64-pad-character-count",
  title: "Encoding: Base64 Pad Character Count Tool",
  description:
    "Compute RFC4648 padded Base64 output length and final equals count from an explicit byte count without encoding content.",
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
