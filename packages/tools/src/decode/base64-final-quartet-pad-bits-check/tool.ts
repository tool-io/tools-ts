import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ quartet: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "quartet", label: "Quartet", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    /^[A-Za-z0-9+/]{2}(?:[A-Za-z0-9+/]{2}|[A-Za-z0-9+/]=|==)(?![\s\S])/.test(
      i.quartet,
    ),
  );
  const alphabet =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    pads = i.quartet.endsWith("==") ? 2 : i.quartet.endsWith("=") ? 1 : 0,
    valid =
      pads === 2
        ? alphabet.indexOf(i.quartet[1]) % 16 === 0
        : pads === 1
          ? alphabet.indexOf(i.quartet[2]) % 4 === 0
          : true;
  return H.finish({
    padCharacters: pads,
    canonicalPadBits: valid,
    decodedByteCount: 3 - pads,
  });
};
export const example = {
  input: { quartet: "Zh==" },
  output: {
    result: { padCharacters: 2, canonicalPadBits: false, decodedByteCount: 1 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/base64-final-quartet-pad-bits-check",
  title: "Decoding: Base64 Final Quartet Pad Bits Check Tool",
  description:
    "Check RFC4648 Base64 final-quartet padding shape and unused pad bits under required four-symbol padding, without decoding an entire stream.",
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
          canonicalPadBits: { type: "boolean" },
          decodedByteCount: { type: "number" },
          padCharacters: { type: "number" },
        },
        required: ["canonicalPadBits", "decodedByteCount", "padCharacters"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
