import {
  defineTool,
  type ToolExecutionContext,
} from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { normalizeRandomSeed } from "../../core/random.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
} from "../../core/result.js";
import { formatUuid, isRecord, randomBytes } from "../../uuid/shared.js";

export type UuidV2Input = {
  readonly clockSequence?: number;
  readonly localDomain: 0 | 1 | 2;
  readonly localIdentifier: number;
  readonly node?: string;
  readonly seed?: number;
  readonly timestamp?: number;
};
export type UuidV2Output = { readonly identifier: string };

const gregorianOffset = 0x01b21dd213814000n;
const maximumUnixTimestampMilliseconds = 103_072_857_660_684;

export const calculateUuidV2 = (
  input: unknown,
  context?: ToolExecutionContext,
) => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const issues: ToolIssue[] = [];
  const allowed = new Set([
    "clockSequence",
    "localDomain",
    "localIdentifier",
    "node",
    "seed",
    "timestamp",
  ]);
  for (const field of Object.keys(input))
    if (!allowed.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not supported.`,
      });
  const timestamp = input.timestamp ?? context?.now?.();
  if (
    !Number.isSafeInteger(timestamp) ||
    (timestamp as number) < 0 ||
    (timestamp as number) > maximumUnixTimestampMilliseconds
  )
    issues.push({
      code: "timestamp_invalid",
      field: "timestamp",
      message:
        "Timestamp must be a nonnegative Unix millisecond integer that fits the UUID 60-bit Gregorian timestamp field.",
    });
  if (
    !Number.isInteger(input.localIdentifier) ||
    (input.localIdentifier as number) < 0 ||
    (input.localIdentifier as number) > 0xffffffff
  )
    issues.push({
      code: "local_identifier_invalid",
      field: "localIdentifier",
      message:
        "Local identifier must be an integer from 0 through 4,294,967,295.",
    });
  if (
    input.localDomain !== 0 &&
    input.localDomain !== 1 &&
    input.localDomain !== 2
  )
    issues.push({
      code: "local_domain_invalid",
      field: "localDomain",
      message:
        "Local domain must be 0 (person), 1 (group), or 2 (organization).",
    });
  if (
    input.clockSequence !== undefined &&
    (!Number.isInteger(input.clockSequence) ||
      (input.clockSequence as number) < 0 ||
      (input.clockSequence as number) > 63)
  )
    issues.push({
      code: "clock_sequence_invalid",
      field: "clockSequence",
      message: "DCE clock sequence must be an integer from 0 through 63.",
    });
  if (
    input.node !== undefined &&
    (typeof input.node !== "string" || !/^[0-9a-f]{12}$/iu.test(input.node))
  )
    issues.push({
      code: "node_invalid",
      field: "node",
      message: "Node must contain exactly 12 hexadecimal characters.",
    });
  if (input.seed !== undefined && !Number.isSafeInteger(input.seed))
    issues.push({
      code: "seed_invalid",
      field: "seed",
      message: "Seed must be a safe integer.",
    });
  if (issues.length) return invalidInput(issues);

  const random = randomBytes(
    8,
    input.seed === undefined
      ? undefined
      : normalizeRandomSeed(input.seed as number),
    context,
  );
  const node = input.node
    ? Uint8Array.from({ length: 6 }, (_, index) =>
        Number.parseInt(
          (input.node as string).slice(index * 2, index * 2 + 2),
          16,
        ),
      )
    : random.slice(0, 6);
  if (!input.node) node[0] = node[0]! | 0x01;
  const uuidTimestamp = BigInt(timestamp as number) * 10_000n + gregorianOffset;
  const bytes = new Uint8Array(16);
  const localIdentifier = input.localIdentifier as number;
  bytes[0] = localIdentifier >>> 24;
  bytes[1] = localIdentifier >>> 16;
  bytes[2] = localIdentifier >>> 8;
  bytes[3] = localIdentifier;
  bytes[4] = Number((uuidTimestamp >> 40n) & 0xffn);
  bytes[5] = Number((uuidTimestamp >> 32n) & 0xffn);
  bytes[6] = 0x20 | Number((uuidTimestamp >> 56n) & 0x0fn);
  bytes[7] = Number((uuidTimestamp >> 48n) & 0xffn);
  bytes[8] =
    0x80 |
    (input.clockSequence === undefined
      ? random[6]! & 0x3f
      : (input.clockSequence as number));
  bytes[9] = input.localDomain as number;
  bytes.set(node, 10);
  return toolSuccess({ identifier: formatUuid(bytes) });
};

export const example = {
  input: {
    clockSequence: 18,
    localDomain: 0,
    localIdentifier: 1000,
    node: "aabbccddeeff",
    timestamp: 1_700_000_000_000,
  },
  output: { identifier: "000003e8-833b-21ee-9200-aabbccddeeff" },
} satisfies ToolExample<UuidV2Input, UuidV2Output>;

export const uuidV2Tool = defineTool<UuidV2Input, UuidV2Output>({
  contractVersion: 1,
  description:
    "Generate a DCE Security UUID version 2 from a local UID/GID-style identifier, local domain, timestamp, clock sequence, and node identifier.",
  discovery: {
    aliases: ["dce security uuid", "uuid v2", "uuid2"],
    keywords: ["dce", "identifier", "uuid"],
  },
  execute: calculateUuidV2,
  execution: { kind: "pure" },
  id: "generate/uuid-v2",
  inputSchema: {
    additionalProperties: false,
    properties: {
      clockSequence: { maximum: 63, minimum: 0, type: "integer" },
      localDomain: { enum: [0, 1, 2], type: "integer" },
      localIdentifier: { maximum: 4_294_967_295, minimum: 0, type: "integer" },
      node: { pattern: "^[0-9a-fA-F]{12}$", type: "string" },
      seed: { type: "integer" },
      timestamp: {
        maximum: maximumUnixTimestampMilliseconds,
        minimum: 0,
        type: "integer",
      },
    },
    required: ["localDomain", "localIdentifier"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: { identifier: { format: "uuid", type: "string" } },
    required: ["identifier"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "localIdentifier",
        label: "Local identifier",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "localDomain",
        label: "Local domain (0 person, 1 group, 2 organization)",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "timestamp",
        label: "Unix time (ms)",
        valueType: { format: "unix-time-ms", type: "integer" },
      },
      {
        id: "clockSequence",
        label: "Clock sequence",
        valueType: { type: "integer" },
      },
      {
        id: "node",
        label: "Node (12 hex characters)",
        valueType: { format: "hex", type: "string" },
      },
      {
        id: "seed",
        label: "Seed",
        valueType: { format: "prng-seed", type: "integer" },
      },
    ],
    outputs: [
      {
        id: "identifier",
        label: "UUID",
        valueType: { format: "uuid", type: "string" },
      },
    ],
  },
  title: "UUID v2 DCE Security Generator",
});
export const runUuidV2 = uuidV2Tool.execute;
export default uuidV2Tool;
