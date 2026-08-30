import type { CHash } from "@noble/hashes/utils.js";
import { bytesToHex } from "@noble/hashes/utils.js";

import { defineTool, type ToolDefinition } from "../core/definition.js";
import { utf8Encode } from "../core/encoding.js";
import type { ToolExample } from "../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../core/result.js";

export type TextHashInput = {
  readonly text: string;
};

export type TextHashOutput = {
  readonly digest: string;
};

type TextHashDefinition = {
  readonly aliases: readonly string[];
  readonly algorithm: CHash;
  readonly description: string;
  readonly digestLength: number;
  readonly id: string;
  readonly keywords: readonly string[];
  readonly title: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const calculateTextHash = (
  input: unknown,
  algorithm: CHash,
): ToolResult<TextHashOutput> => {
  if (!isRecord(input) || typeof input.text !== "string")
    return invalidInput([
      {
        code: "text_required",
        field: "text",
        message: "Text is required.",
      },
    ]);
  if (Object.keys(input).some((field) => field !== "text"))
    return invalidInput([
      {
        code: "unknown_field",
        field: "",
        message: "Only text is supported.",
      },
    ]);
  if (input.text.length > 1_000_000)
    return invalidInput([
      {
        code: "resource_limit_exceeded",
        field: "text",
        message: "Text must contain at most 1,000,000 characters.",
      },
    ]);

  return toolSuccess({
    digest: bytesToHex(algorithm(Uint8Array.from(utf8Encode(input.text)))),
  });
};

export const createTextHashTool = (
  definition: TextHashDefinition,
): ToolDefinition<TextHashInput, TextHashOutput> =>
  defineTool<TextHashInput, TextHashOutput>({
    contractVersion: 1,
    description: definition.description,
    discovery: {
      aliases: definition.aliases,
      collections: ["encode-decode", "security"],
      keywords: ["digest", "hash", "text", ...definition.keywords],
    },
    execute: (input) => calculateTextHash(input, definition.algorithm),
    execution: { kind: "pure" },
    id: definition.id,
    inputSchema: {
      additionalProperties: false,
      properties: {
        text: {
          description: "Text to encode as UTF-8 before hashing.",
          maxLength: 1_000_000,
          type: "string",
        },
      },
      required: ["text"],
      type: "object",
    },
    outputSchema: {
      additionalProperties: false,
      properties: {
        digest: {
          description: "Lowercase hexadecimal message digest.",
          pattern: `^[0-9a-f]{${definition.digestLength}}$`,
          type: "string",
        },
      },
      required: ["digest"],
      type: "object",
    },
    ports: {
      inputs: [
        {
          description: "Text to hash as UTF-8.",
          id: "text",
          label: "Text",
          required: true,
          valueType: { format: "text", type: "string" },
        },
      ],
      outputs: [
        {
          description: "Lowercase hexadecimal message digest.",
          id: "digest",
          label: "Digest",
          valueType: { format: "hex", type: "string" },
        },
      ],
    },
    title: definition.title,
  });

export const createTextHashExample = (
  algorithm: CHash,
): ToolExample<TextHashInput, TextHashOutput> => ({
  input: { text: "hello" },
  output: {
    digest: bytesToHex(algorithm(Uint8Array.from(utf8Encode("hello")))),
  },
});

export type TextXofInput = {
  readonly outputLengthBytes?: number;
  readonly text: string;
};

type TextXofDefinition = Omit<
  TextHashDefinition,
  "algorithm" | "digestLength"
> & {
  readonly algorithm: (
    message: Uint8Array,
    options: { readonly dkLen: number },
  ) => Uint8Array;
  readonly defaultOutputLengthBytes: number;
};

export const createTextXofTool = (
  definition: TextXofDefinition,
): ToolDefinition<TextXofInput, TextHashOutput> =>
  defineTool<TextXofInput, TextHashOutput>({
    contractVersion: 1,
    description: definition.description,
    discovery: {
      aliases: definition.aliases,
      collections: ["encode-decode", "security"],
      keywords: ["digest", "hash", "text", "xof", ...definition.keywords],
    },
    execute: (input) => {
      if (!isRecord(input) || typeof input.text !== "string")
        return invalidInput([
          {
            code: "text_required",
            field: "text",
            message: "Text is required.",
          },
        ]);
      if (
        Object.keys(input).some(
          (field) => field !== "text" && field !== "outputLengthBytes",
        )
      )
        return invalidInput([
          {
            code: "unknown_field",
            field: "",
            message: "Only text and outputLengthBytes are supported.",
          },
        ]);
      if (input.text.length > 1_000_000)
        return invalidInput([
          {
            code: "resource_limit_exceeded",
            field: "text",
            message: "Text must contain at most 1,000,000 characters.",
          },
        ]);
      const outputLengthBytes =
        input.outputLengthBytes ?? definition.defaultOutputLengthBytes;
      if (
        typeof outputLengthBytes !== "number" ||
        !Number.isSafeInteger(outputLengthBytes) ||
        outputLengthBytes < 1 ||
        outputLengthBytes > 1024
      )
        return invalidInput([
          {
            code: "output_length_invalid",
            field: "outputLengthBytes",
            message:
              "Output length must be an integer from 1 through 1,024 bytes.",
          },
        ]);
      return toolSuccess({
        digest: bytesToHex(
          definition.algorithm(Uint8Array.from(utf8Encode(input.text)), {
            dkLen: outputLengthBytes,
          }),
        ),
      });
    },
    execution: { kind: "pure" },
    id: definition.id,
    inputSchema: {
      additionalProperties: false,
      properties: {
        outputLengthBytes: {
          default: definition.defaultOutputLengthBytes,
          maximum: 1024,
          minimum: 1,
          type: "integer",
        },
        text: { maxLength: 1_000_000, type: "string" },
      },
      required: ["text"],
      type: "object",
    },
    outputSchema: {
      additionalProperties: false,
      properties: { digest: { pattern: "^[0-9a-f]+$", type: "string" } },
      required: ["digest"],
      type: "object",
    },
    ports: {
      inputs: [
        {
          id: "text",
          label: "Text",
          required: true,
          valueType: { format: "text", type: "string" },
        },
        {
          id: "outputLengthBytes",
          label: "Output length (bytes)",
          valueType: { format: "bytes", type: "integer" },
        },
      ],
      outputs: [
        {
          id: "digest",
          label: "Digest",
          valueType: { format: "hex", type: "string" },
        },
      ],
    },
    title: definition.title,
  });

export const createTextXofExample = (
  algorithm: (
    message: Uint8Array,
    options: { readonly dkLen: number },
  ) => Uint8Array,
  outputLengthBytes: number,
): ToolExample<TextXofInput, TextHashOutput> => ({
  input: { outputLengthBytes, text: "hello" },
  output: {
    digest: bytesToHex(
      algorithm(Uint8Array.from(utf8Encode("hello")), {
        dkLen: outputLengthBytes,
      }),
    ),
  },
});
