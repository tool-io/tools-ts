import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { value: "300" },
  output: { hex: "AC02" },
} satisfies ToolExample<{ readonly value: string }, { readonly hex: string }>;
export const tool = createSimpleTool({
  id: "encode/varint",
  title: "Unsigned Varint Encoder",
  description:
    "Encode an exact decimal integer from 0 through 2^64−1 as unsigned LEB128 bytes, shown as uppercase hexadecimal. Signed zigzag encoding is a separate tool.",
  inputs: [{ id: "value", kind: "string", label: "Unsigned decimal integer" }],
  outputs: [{ id: "hex", kind: "string", label: "Varint bytes (hex)" }],
  calculate: (input) => {
    const raw = input.value as string;
    if (!/^(0|[1-9]\d*)$/.test(raw))
      simpleError(
        "value",
        "Enter a nonnegative decimal integer without sign or leading zeros.",
      );
    let value = BigInt(raw);
    if (value > 0xffffffffffffffffn)
      simpleError("value", "Unsigned varint is limited to 64 bits.");
    const bytes: number[] = [];
    do {
      let byte = Number(value & 0x7fn);
      value >>= 7n;
      if (value) byte |= 0x80;
      bytes.push(byte);
    } while (value);
    return {
      hex: bytes
        .map((byte) => byte.toString(16).toUpperCase().padStart(2, "0"))
        .join(""),
    };
  },
});
export type VarintInput = Readonly<typeof example.input>;
export type VarintOutput = Readonly<typeof example.output>;
export const varintTool = tool;
export const runVarint = tool.execute;
export default tool;
