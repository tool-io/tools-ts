import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  finalSymbol: string;
  symbolCount: number;
  variant: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "finalSymbol", label: "Final symbol", kind: "string" },
  { id: "symbolCount", label: "Symbol count", kind: "integer" },
  {
    id: "variant",
    label: "Variant",
    kind: "string",
    enum: ["base32", "base32hex"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.variant, ["base32", "base32hex"]);
  const alphabet =
    i.variant === "base32"
      ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
      : "0123456789ABCDEFGHIJKLMNOPQRSTUV";
  H.check(
    i.finalSymbol.length === 1 &&
      alphabet.includes(i.finalSymbol) &&
      [2, 4, 5, 7, 8].includes(i.symbolCount),
  );
  const index = alphabet.indexOf(i.finalSymbol),
    bits = ({ 2: 2, 4: 4, 5: 1, 7: 3, 8: 0 } as Record<number, number>)[
      i.symbolCount
    ];
  return H.finish({
    unusedBits: bits,
    canonicalPadBits: index % 2 ** bits === 0,
  });
};
export const example = {
  input: { finalSymbol: "B", symbolCount: 2, variant: "base32" },
  output: { result: { unusedBits: 2, canonicalPadBits: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/base32-final-symbol-pad-bits-check",
  title: "Decoding: Base32 Final Symbol Pad Bits Check Tool",
  description:
    "Inspect unused bits of a final RFC4648 Base32/Base32hex symbol for a supplied unpadded final-block symbol count; no whole-stream decode.",
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
          unusedBits: { type: "number" },
        },
        required: ["canonicalPadBits", "unusedBits"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
