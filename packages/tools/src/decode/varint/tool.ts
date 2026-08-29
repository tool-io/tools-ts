import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { hex: "AC02" },
  output: { value: "300" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "decode/varint",
  title: "Unsigned Varint Decoder",
  description:
    "Decode one unsigned LEB128 varint from a hexadecimal byte string, returning the exact integer as decimal text. Rejects trailing bytes and encodings beyond 64 bits.",
  inputs: [{ id: "hex", kind: "string", label: "hex" }],
  outputs: [{ id: "value", kind: "string", label: "value" }],
  calculate: (input) => {
    const hex = (input.hex as string).replace(/\s+/g, "");
    if (!/^(?:[0-9a-fA-F]{2}){1,10}$/.test(hex))
      simpleError("hex", "Enter 1–10 hexadecimal bytes.");
    let result = 0n,
      finished = false;
    for (let i = 0; i < hex.length / 2; i++) {
      const byte = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
      if (finished)
        simpleError("hex", "Trailing bytes follow the varint terminator.");
      if (i === 9 && byte > 1)
        simpleError("hex", "Varint exceeds unsigned 64-bit range.");
      result |= BigInt(byte & 0x7f) << BigInt(i * 7);
      finished = (byte & 0x80) === 0;
    }
    if (!finished) simpleError("hex", "Varint is unterminated.");
    return { value: result.toString() };
  },
});
export type VarintInput = Readonly<typeof example.input>;
export type VarintOutput = Readonly<typeof example.output>;
export const varintTool = tool;
export const runVarint = tool.execute;
export default tool;
