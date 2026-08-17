import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";
import { utf8Decode } from "../../core/encoding.js";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
/** Allowed unpadded data lengths within an 8-character block (RFC 4648). */
const BLOCK_REMAINDERS = new Set([0, 2, 4, 5, 7]);

export type Base32DecoderInput = {
  readonly base32: string;
};

export type Base32DecoderOutput = {
  readonly text: string;
};

export const base32DecoderExample = {
  input: { base32: "MZXW6YTBOI======" },
  output: { text: "foobar" },
} satisfies ToolExample<Base32DecoderInput, Base32DecoderOutput>;

const decodePure = (base32: string): string => {
  let buffer = 0;
  let bits = 0;
  const bytes: number[] = [];
  for (const character of base32) {
    if (character === "=") break;
    buffer = (buffer << 5) | ALPHABET.indexOf(character);
    bits += 5;
    if (bits >= 8) {
      bytes.push((buffer >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return utf8Decode(bytes, "base32");
};

/** RFC 4648 canonical-form validation; returns the first issue found. */
const validationIssue = (input: string): ToolIssue | undefined => {
  const padded = input.match(/=*$/)?.[0].length ?? 0;
  const data = input.slice(0, input.length - padded);
  if (/=/.test(data))
    return {
      code: "padding_misplaced",
      field: "base32",
      message: "Padding is only allowed as a trailing run.",
    };
  if (!/^[A-Z2-7]*$/.test(data))
    return {
      code: "alphabet_invalid",
      field: "base32",
      message: "base32 must contain only A-Z, 2-7, and padding.",
    };
  if (padded > 0 && input.length % 8 !== 0)
    return {
      code: "block_incomplete",
      field: "base32",
      message: "Padded base32 blocks must be 8 characters long.",
    };
  if (data.length % 8 !== 0 && !BLOCK_REMAINDERS.has(data.length % 8))
    return {
      code: "block_incomplete",
      field: "base32",
      message: "Data length must leave 0, 2, 4, 5, or 7 characters per block.",
    };
  // Trailing bits discarded by decoding must all be zero.
  let buffer = 0;
  let bits = 0;
  for (const character of data) {
    buffer = (buffer << 5) | ALPHABET.indexOf(character);
    bits += 5;
    if (bits >= 8) {
      buffer &= (1 << bits) - 1;
      bits -= 8;
    }
  }
  if (bits > 0 && (buffer & ((1 << bits) - 1)) !== 0)
    return {
      code: "trailing_bits_noncanonical",
      field: "base32",
      message: "Trailing bits must be zero in canonical base32.",
    };
  return undefined;
};

export const decodeBase32 = (base32: string): string => decodePure(base32);

export const runBase32Decoder = (
  input: unknown,
): ToolResult<Base32DecoderOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (field !== "base32")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });
  const base32 = input.base32;
  if (typeof base32 !== "string")
    return invalidInput([
      ...issues,
      {
        code: "base32_required",
        field: "base32",
        message: "base32 is required as a string.",
      },
    ]);
  if (issues.length > 0) return invalidInput(issues);
  const issue = validationIssue(base32);
  if (issue) return invalidInput([issue]);
  return toolSuccess({ text: decodeBase32(base32) });
};

export const base32DecoderTool = defineTool<
  Base32DecoderInput,
  Base32DecoderOutput
>({
  contractVersion: 1,
  description:
    "Decode canonical RFC 4648 base32 text back into UTF-8, rejecting misplaced padding and non-canonical bits.",
  discovery: {
    aliases: ["base32-decoder"],
    keywords: ["base32", "decode", "rfc4648"],
  },
  execute: runBase32Decoder,
  execution: { kind: "pure" },
  id: "decode/base32",
  inputSchema: {
    additionalProperties: false,
    properties: {
      base32: {
        description: "Canonical padded base32 text.",
        maxLength: 1048576,
        minLength: 0,
        type: "string",
      },
    },
    required: ["base32"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      text: { description: "Decoded UTF-8 text.", minLength: 0, type: "string" },
    },
    required: ["text"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        description: "Padded base32 text.",
        id: "base32",
        label: "Base32",
        required: true,
        valueType: { format: "base32", type: "string" },
      },
    ],
    outputs: [
      {
        description: "Decoded UTF-8 text.",
        id: "text",
        label: "Text",
        valueType: { type: "string" },
      },
    ],
  },
  title: "Base32 Decoder",
});

export const example = base32DecoderExample;
export default base32DecoderTool;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
