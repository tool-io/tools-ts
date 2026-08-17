import { resourceLimitIssue } from "../../core/limits.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type Crc32Input = {
  readonly bytes: string;
};

export type Crc32Output = {
  readonly checksumHex: string;
};

export const crc32InputSchema = {
  additionalProperties: false,
  properties: {
    bytes: {
      description: "Raw byte string to checksum; each character is one byte.",
      maxLength: 1000000,
      minLength: 1,
      type: "string",
    },
  },
  required: ["bytes"],
  type: "object",
} as const;

export const crc32OutputSchema = {
  additionalProperties: false,
  properties: {
    checksumHex: {
      description: "CRC-32 checksum in uppercase hexadecimal.",
      pattern: "^[0-9A-F]{8}$",
      type: "string",
    },
  },
  required: ["checksumHex"],
  type: "object",
} as const;

export const crc32Example = {
  input: { bytes: "123456789" },
  output: { checksumHex: "CBF43926" },
} satisfies ToolExample<Crc32Input, Crc32Output>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Reversed CRC-32 polynomial 0xEDB88320. */
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1)
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    table[index] = value >>> 0;
  }
  return table;
})();

export const isCrc32Output = (value: unknown): value is Crc32Output =>
  isRecord(value) &&
  typeof value.checksumHex === "string" &&
  /^[0-9A-F]{8}$/.test(value.checksumHex);

export const calculateCrc32 = (
  input: unknown,
): ToolResult<Crc32Output> => {
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
    if (field !== "bytes")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const rawBytes = input.bytes;
  if (rawBytes === undefined)
    return invalidInput([
      ...issues,
      {
        code: "bytes_required",
        field: "bytes",
        message: "bytes is required.",
      },
    ]);
  if (
    typeof rawBytes !== "string"
  )
    return invalidInput([
      ...issues,
      {
        code: "bytes_invalid",
        field: "bytes",
        message: "bytes must be a string.",
      },
    ]);
  const limitIssue = resourceLimitIssue(
    "textCharacters",
    rawBytes.length,
    "bytes",
  );
  if (limitIssue) return invalidInput([...issues, limitIssue]);
  if (issues.length > 0) return invalidInput(issues);

  let checksum = 0xffffffff;
  for (let index = 0; index < rawBytes.length; index += 1)
    checksum =
      CRC_TABLE[(checksum ^ (rawBytes.charCodeAt(index) & 0xff)) & 0xff] ^
      (checksum >>> 8);
  checksum = (checksum ^ 0xffffffff) >>> 0;

  return toolSuccess({ checksumHex: checksum.toString(16).toUpperCase().padStart(8, "0") });
};

export const crc32Tool = defineTool<Crc32Input, Crc32Output>({
  contractVersion: 1,
  description:
    "Compute the CRC-32 checksum of a byte string using the reversed polynomial 0xEDB88320.",
  discovery: {
    aliases: ["crc-checksum", "crc32-hex"],
    keywords: ["checksum", "crc", "integrity"],
  },
  execute: calculateCrc32,
  execution: { kind: "pure" },
  id: "encode/crc32",
  inputSchema: crc32InputSchema,
  outputSchema: crc32OutputSchema,
  ports: {
    inputs: [
      {
        description: "Byte string to checksum.",
        id: "bytes",
        label: "Bytes",
        required: true,
        valueType: { format: "bytes", type: "string" },
      },
    ],
    outputs: [
      {
        description: "Checksum in uppercase hexadecimal.",
        id: "checksumHex",
        label: "Checksum",
        valueType: { format: "hex", type: "string" },
      },
    ],
  },
  title: "CRC-32 Checksum",
});

export const runCrc32 = crc32Tool.execute;
export default crc32Tool;
