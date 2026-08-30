import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { isRecord, uuidPattern, uuidRegex } from "../../uuid/shared.js";

export type ParseUuidInput = { readonly uuid: string };
export type UuidVariant = "future" | "microsoft" | "ncs" | "rfc-9562";
export type UuidKind =
  | "custom-v8"
  | "dce-security-v2"
  | "max"
  | "name-based-md5-v3"
  | "name-based-sha1-v5"
  | "nil"
  | "random-v4"
  | "reordered-time-v6"
  | "time-based-v1"
  | "unix-time-v7"
  | "unknown";
export type ParseUuidOutput = {
  readonly bytes: readonly number[];
  readonly clockSequence: number | null;
  readonly kind: UuidKind;
  readonly localDomain: number | null;
  readonly localIdentifier: number | null;
  readonly node: string;
  readonly normalized: string;
  readonly timestampUnixMilliseconds: number | null;
  readonly variant: UuidVariant;
  readonly version: number;
};

const variantFor = (byte: number): UuidVariant => {
  if ((byte & 0x80) === 0) return "ncs";
  if ((byte & 0xc0) === 0x80) return "rfc-9562";
  if ((byte & 0xe0) === 0xc0) return "microsoft";
  return "future";
};

const readBytes = (
  bytes: readonly number[],
  start: number,
  length: number,
): bigint => {
  let value = 0n;
  for (let index = start; index < start + length; index += 1)
    value = (value << 8n) | BigInt(bytes[index]!);
  return value;
};

const timestampFor = (
  bytes: readonly number[],
  version: number,
): number | null => {
  if (version === 7) return Number(readBytes(bytes, 0, 6));
  if (version !== 1 && version !== 6) return null;
  const gregorian =
    version === 1
      ? ((readBytes(bytes, 6, 2) & 0x0fffn) << 48n) |
        (readBytes(bytes, 4, 2) << 32n) |
        readBytes(bytes, 0, 4)
      : (readBytes(bytes, 0, 4) << 28n) |
        (readBytes(bytes, 4, 2) << 12n) |
        (readBytes(bytes, 6, 2) & 0x0fffn);
  return Number((gregorian - 0x01b21dd213814000n) / 10_000n);
};

const kindFor = (
  normalized: string,
  variant: UuidVariant,
  version: number,
): UuidKind => {
  if (normalized === "00000000-0000-0000-0000-000000000000") return "nil";
  if (normalized === "ffffffff-ffff-ffff-ffff-ffffffffffff") return "max";
  if (variant !== "rfc-9562") return "unknown";
  return (
    (
      {
        1: "time-based-v1",
        2: "dce-security-v2",
        3: "name-based-md5-v3",
        4: "random-v4",
        5: "name-based-sha1-v5",
        6: "reordered-time-v6",
        7: "unix-time-v7",
        8: "custom-v8",
      } as const
    )[version as 1] ?? "unknown"
  );
};

export const calculateParseUuid = (
  input: unknown,
): ToolResult<ParseUuidOutput> => {
  if (
    !isRecord(input) ||
    typeof input.uuid !== "string" ||
    !uuidRegex.test(input.uuid)
  )
    return invalidInput([
      {
        code: "uuid_invalid",
        field: "uuid",
        message:
          "Enter a canonical 36-character UUID with hexadecimal digits and hyphens.",
      },
    ]);
  if (Object.keys(input).some((field) => field !== "uuid"))
    return invalidInput([
      { code: "unknown_field", field: "", message: "Only uuid is supported." },
    ]);
  const normalized = input.uuid.toLowerCase();
  const hexadecimal = normalized.replaceAll("-", "");
  const bytes = Array.from({ length: 16 }, (_, index) =>
    Number.parseInt(hexadecimal.slice(index * 2, index * 2 + 2), 16),
  );
  const variant = variantFor(bytes[8]!);
  const version = bytes[6]! >>> 4;
  const timeAndNodeBased =
    variant === "rfc-9562" && (version === 1 || version === 2 || version === 6);
  return toolSuccess({
    bytes,
    clockSequence: timeAndNodeBased
      ? version === 2
        ? bytes[8]! & 0x3f
        : ((bytes[8]! & 0x3f) << 8) | bytes[9]!
      : null,
    kind: kindFor(normalized, variant, version),
    localDomain: variant === "rfc-9562" && version === 2 ? bytes[9]! : null,
    localIdentifier:
      variant === "rfc-9562" && version === 2
        ? Number(readBytes(bytes, 0, 4))
        : null,
    node: timeAndNodeBased ? hexadecimal.slice(20) : "",
    normalized,
    timestampUnixMilliseconds: timestampFor(bytes, version),
    variant,
    version,
  });
};

export const example = {
  input: { uuid: "018bcfe5-6800-7363-8c90-c7b63c022670" },
  output: {
    bytes: [
      1, 139, 207, 229, 104, 0, 115, 99, 140, 144, 199, 182, 60, 2, 38, 112,
    ],
    clockSequence: null,
    kind: "unix-time-v7",
    localDomain: null,
    localIdentifier: null,
    node: "",
    normalized: "018bcfe5-6800-7363-8c90-c7b63c022670",
    timestampUnixMilliseconds: 1_700_000_000_000,
    variant: "rfc-9562",
    version: 7,
  },
} satisfies ToolExample<ParseUuidInput, ParseUuidOutput>;

export const parseUuidTool = defineTool<ParseUuidInput, ParseUuidOutput>({
  contractVersion: 1,
  description:
    "Parse Nil, Max, and UUID versions 1 through 8 into normalized text, bytes, version, variant, semantic kind, and available time or DCE fields.",
  discovery: {
    aliases: ["decode uuid", "inspect uuid", "uuid parser"],
    keywords: ["guid", "identifier", "uuid", "version"],
  },
  execute: calculateParseUuid,
  execution: { kind: "pure" },
  id: "parse/uuid",
  inputSchema: {
    additionalProperties: false,
    properties: { uuid: { pattern: uuidPattern, type: "string" } },
    required: ["uuid"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      bytes: {
        items: { maximum: 255, minimum: 0, type: "integer" },
        maxItems: 16,
        minItems: 16,
        type: "array",
      },
      clockSequence: {
        anyOf: [{ minimum: 0, type: "integer" }, { type: "null" }],
      },
      kind: {
        enum: [
          "custom-v8",
          "dce-security-v2",
          "max",
          "name-based-md5-v3",
          "name-based-sha1-v5",
          "nil",
          "random-v4",
          "reordered-time-v6",
          "time-based-v1",
          "unix-time-v7",
          "unknown",
        ],
        type: "string",
      },
      localDomain: {
        anyOf: [{ minimum: 0, type: "integer" }, { type: "null" }],
      },
      localIdentifier: {
        anyOf: [{ minimum: 0, type: "integer" }, { type: "null" }],
      },
      node: { type: "string" },
      normalized: { pattern: uuidPattern, type: "string" },
      timestampUnixMilliseconds: {
        anyOf: [{ type: "integer" }, { type: "null" }],
      },
      variant: {
        enum: ["future", "microsoft", "ncs", "rfc-9562"],
        type: "string",
      },
      version: { maximum: 15, minimum: 0, type: "integer" },
    },
    required: [
      "bytes",
      "clockSequence",
      "kind",
      "localDomain",
      "localIdentifier",
      "node",
      "normalized",
      "timestampUnixMilliseconds",
      "variant",
      "version",
    ],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "uuid",
        label: "UUID",
        required: true,
        valueType: { format: "uuid", type: "string" },
      },
    ],
    outputs: [
      {
        id: "normalized",
        label: "Normalized UUID",
        valueType: { format: "uuid", type: "string" },
      },
      {
        id: "version",
        label: "Version",
        valueType: { format: "uuid-version", type: "integer" },
      },
      { id: "kind", label: "UUID kind", valueType: { type: "string" } },
      {
        id: "variant",
        label: "Variant",
        valueType: { format: "uuid-variant", type: "string" },
      },
      {
        id: "timestampUnixMilliseconds",
        label: "Unix timestamp (ms)",
        valueType: { format: "unix-time-ms", type: "integer" },
      },
      {
        id: "clockSequence",
        label: "Clock sequence",
        valueType: { type: "integer" },
      },
      {
        id: "node",
        label: "Node",
        valueType: { format: "hex", type: "string" },
      },
      {
        id: "localDomain",
        label: "DCE local domain",
        valueType: { type: "integer" },
      },
      {
        id: "localIdentifier",
        label: "DCE local identifier",
        valueType: { type: "integer" },
      },
      {
        id: "bytes",
        label: "Bytes",
        valueType: { items: { type: "integer" }, type: "list" },
      },
    ],
  },
  title: "UUID Parser",
});
export const runParseUuid = parseUuidTool.execute;
export default parseUuidTool;
