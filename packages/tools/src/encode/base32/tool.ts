import { utf8Encode } from "../../core/encoding.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const PADDED_LENGTHS = new Set([0, 2, 4, 5, 7, 8]);

export type Base32EncoderInput = {
  readonly text: string;
};

export type Base32EncoderOutput = {
  readonly encoded: string;
};

export const base32EncoderExample = {
  input: { text: "foobar" },
  output: { encoded: "MZXW6YTBOI======", },
} satisfies ToolExample<Base32EncoderInput, Base32EncoderOutput>;

export const encodeBase32 = (text: string): string => {
  const bytes = utf8Encode(text);
  let output = "";
  let buffer = 0;
  let bits = 0;
  for (let index = 0; index < bytes.length; index += 1) {
    buffer = (buffer << 8) | bytes[index];
    bits += 8;
    while (bits >= 5) {
      output += ALPHABET[(buffer >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += ALPHABET[(buffer << (5 - bits)) & 31];
  while (output.length % 8 !== 0) output += "=";
  return output;
};

export const runBase32Encoder = (
  input: unknown,
): ToolResult<Base32EncoderOutput> => {
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
    if (field !== "text")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });
  const text = input.text;
  if (typeof text !== "string")
    return invalidInput([
      ...issues,
      {
        code: "text_required",
        field: "text",
        message: "text is required as a string.",
      },
    ]);
  if (issues.length > 0) return invalidInput(issues);
  return toolSuccess({ encoded: encodeBase32(text) });
};

export const base32EncoderTool = defineTool<
  Base32EncoderInput,
  Base32EncoderOutput
>({
  contractVersion: 1,
  description:
    "Encode UTF-8 text as RFC 4648 base32 using letters A-Z and digits 2-7 with padding.",
  discovery: {
    aliases: ["base32-encoder"],
    keywords: ["base32", "encode", "rfc4648"],
  },
  execute: runBase32Encoder,
  execution: { kind: "pure" },
  id: "encode/base32",
  inputSchema: {
    additionalProperties: false,
    properties: {
      text: { description: "Text to encode.", minLength: 0, type: "string" },
    },
    required: ["text"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      encoded: {
        description: "Padded base32 text.",
        pattern: "^(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2,7}={0,6})?$",
        type: "string",
      },
    },
    required: ["encoded"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        description: "Text to encode.",
        id: "text",
        label: "Text",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        description: "Padded base32 text.",
        id: "encoded",
        label: "Encoded",
        valueType: { format: "base32", type: "string" },
      },
    ],
  },
  title: "Base32 Encoder",
});

export const example = base32EncoderExample;
export default base32EncoderTool;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
