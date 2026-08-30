import { utf8Encode } from "../core/encoding.js";
import { invalidInput, toolSuccess, type ToolResult } from "../core/result.js";
import { defineTool, type ToolDefinition } from "../core/definition.js";
import type { ToolExample } from "../core/example.js";

export type ChecksumInput = { readonly text: string };
export type ChecksumOutput = { readonly checksum: string };

export const checksumBytes = (
  input: unknown,
  calculate: (bytes: readonly number[]) => number,
  width: number,
): ToolResult<ChecksumOutput> => {
  if (
    typeof input !== "object" ||
    input === null ||
    Array.isArray(input) ||
    typeof (input as Record<string, unknown>).text !== "string"
  )
    return invalidInput([
      { code: "text_required", field: "text", message: "Text is required." },
    ]);
  if (Object.keys(input).some((field) => field !== "text"))
    return invalidInput([
      {
        code: "unknown_field",
        field: "",
        message: "Only text is supported.",
      },
    ]);
  const text = (input as Record<string, string>).text;
  if (text.length > 1_000_000)
    return invalidInput([
      {
        code: "resource_limit_exceeded",
        field: "text",
        message: "Text must contain at most 1,000,000 characters.",
      },
    ]);
  return toolSuccess({
    checksum: calculate(utf8Encode(text))
      .toString(16)
      .toUpperCase()
      .padStart(width, "0"),
  });
};

export const checksumInputSchema = {
  additionalProperties: false,
  properties: {
    text: {
      description: "Text to encode as UTF-8 before calculating the checksum.",
      maxLength: 1_000_000,
      type: "string",
    },
  },
  required: ["text"],
  type: "object",
} as const;

export const checksumPorts = {
  inputs: [
    {
      description: "Text to checksum as UTF-8.",
      id: "text",
      label: "Text",
      required: true,
      valueType: { format: "text", type: "string" as const },
    },
  ],
  outputs: [
    {
      description: "Uppercase hexadecimal checksum.",
      id: "checksum",
      label: "Checksum",
      valueType: { format: "hex", type: "string" as const },
    },
  ],
};

export const checksumOutputSchema = (width: number) =>
  ({
    additionalProperties: false,
    properties: {
      checksum: {
        description: "Uppercase hexadecimal checksum.",
        pattern: `^[0-9A-F]{${width}}$`,
        type: "string",
      },
    },
    required: ["checksum"],
    type: "object",
  }) as const;

type ChecksumDefinition = {
  readonly aliases: readonly string[];
  readonly calculate: (bytes: readonly number[]) => bigint;
  readonly checkValue: string;
  readonly description: string;
  readonly id: string;
  readonly keywords?: readonly string[];
  readonly title: string;
  readonly width: number;
};

const calculateChecksum = (
  input: unknown,
  calculate: (bytes: readonly number[]) => bigint,
  width: number,
): ToolResult<ChecksumOutput> => {
  if (
    typeof input !== "object" ||
    input === null ||
    Array.isArray(input) ||
    typeof (input as Record<string, unknown>).text !== "string"
  )
    return invalidInput([
      { code: "text_required", field: "text", message: "Text is required." },
    ]);
  if (Object.keys(input).some((field) => field !== "text"))
    return invalidInput([
      { code: "unknown_field", field: "", message: "Only text is supported." },
    ]);
  const text = (input as Record<string, string>).text;
  if (text.length > 1_000_000)
    return invalidInput([
      {
        code: "resource_limit_exceeded",
        field: "text",
        message: "Text must contain at most 1,000,000 characters.",
      },
    ]);
  return toolSuccess({
    checksum: calculate(utf8Encode(text))
      .toString(16)
      .toUpperCase()
      .padStart(width, "0"),
  });
};

export const createChecksumTool = (
  definition: ChecksumDefinition,
): ToolDefinition<ChecksumInput, ChecksumOutput> =>
  defineTool<ChecksumInput, ChecksumOutput>({
    contractVersion: 1,
    description: definition.description,
    discovery: {
      aliases: definition.aliases,
      collections: ["encode-decode"],
      keywords: ["checksum", "integrity", ...(definition.keywords ?? [])],
    },
    execute: (input) =>
      calculateChecksum(input, definition.calculate, definition.width),
    execution: { kind: "pure" },
    id: definition.id,
    inputSchema: checksumInputSchema,
    outputSchema: checksumOutputSchema(definition.width),
    ports: checksumPorts,
    title: definition.title,
  });

export const createChecksumExample = (
  checkValue: string,
): ToolExample<ChecksumInput, ChecksumOutput> => ({
  input: { text: "123456789" },
  output: { checksum: checkValue },
});
