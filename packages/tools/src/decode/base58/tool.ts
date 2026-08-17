import { utf8Decode } from "../../core/encoding.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const BASE58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

/** Maximum UTF-8 length accepted; keeps BigInt conversion cost bounded. */
export const MAX_BASE58_BYTES = 65_536;

export const base58DecoderExample = {
  input: { base58: "2NEpo7TZRRrLZSi2U" },
  output: { text: "Hello World!" },
} satisfies ToolExample<{ readonly base58: string }, { readonly text: string }>;

/**
 * Converts UTF-8 bytes to their Base58 (Bitcoin alphabet) representation.
 * Each leading zero byte becomes a leading "1".
 */
export const encodeBase58Bytes = (
  bytes: readonly number[],
  field = "text",
): string => {
  if (bytes.length > MAX_BASE58_BYTES)
    simpleError(
      field,
      `Base58 encoding supports up to ${MAX_BASE58_BYTES.toLocaleString("en-US")} bytes.`,
      "resource_limit_exceeded",
    );
  let zeros = 0;
  while (zeros < bytes.length && bytes[zeros] === 0) zeros += 1;
  let value = 0n;
  for (const byte of bytes) value = (value << 8n) | BigInt(byte);
  let digits = "";
  while (value > 0n) {
    digits = BASE58_ALPHABET[Number(value % 58n)]! + digits;
    value /= 58n;
  }
  return "1".repeat(zeros) + digits;
};

/** Reverses Base58 back to UTF-8 bytes, validating the strict alphabet. */
export const decodeBase58Bytes = (
  value: string,
  field = "base58",
): number[] => {
  if (value.length > (MAX_BASE58_BYTES * 137) / 100 + 1)
    simpleError(
      field,
      `Base58 decoding supports up to ${MAX_BASE58_BYTES.toLocaleString("en-US")} bytes.`,
      "resource_limit_exceeded",
    );
  let zeros = 0;
  while (zeros < value.length && value[zeros] === "1") zeros += 1;
  let decoded = 0n;
  for (const character of value.slice(zeros)) {
    const digit = BASE58_ALPHABET.indexOf(character);
    if (digit < 0)
      simpleError(
        field,
        "Value contains characters outside the Base58 alphabet.",
        "alphabet_invalid",
      );
    decoded = decoded * 58n + BigInt(digit);
  }
  const bytes: number[] = [];
  while (decoded > 0n) {
    bytes.unshift(Number(decoded & 0xffn));
    decoded >>= 8n;
  }
  return [...new Array<number>(zeros).fill(0), ...bytes];
};

export const base58DecodeTool = createSimpleTool({
  calculate: (input) => {
    const value = String(input.base58 ?? "").trim();
    const bytes = decodeBase58Bytes(value);
    if (bytes.length > MAX_BASE58_BYTES)
      simpleError(
        "base58",
        `Base58 decoding supports up to ${MAX_BASE58_BYTES.toLocaleString("en-US")} bytes.`,
        "resource_limit_exceeded",
      );
    return { text: utf8Decode(bytes, "base58") };
  },
  description:
    "Decode Base58 (Bitcoin alphabet) text into its UTF-8 source text.",
  id: "decode/base58",
  inputs: [
    {
      description: "Base58 text using the Bitcoin alphabet.",
      id: "base58",
      kind: "string",
      label: "Base58",
    },
  ],
  outputs: [
    {
      description: "Decoded UTF-8 text.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  title: "Base58 Decoder",
});
export const runBase58Decoder = base58DecodeTool.execute;
export default base58DecodeTool;
