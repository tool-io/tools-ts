import {
  defineTool,
  type ToolDefinition,
  type ToolExecutionContext,
} from "../core/definition.js";
import type { ToolExample } from "../core/example.js";
import { normalizeRandomSeed } from "../core/random.js";
import { invalidInput, toolSuccess, type ToolIssue } from "../core/result.js";
import {
  formatUuid,
  generationIssues,
  isRecord,
  randomBytes,
} from "./shared.js";

export type TimeBasedUuidInput = {
  readonly clockSequence?: number;
  readonly count?: number;
  readonly node?: string;
  readonly seed?: number;
  readonly timestamp?: number;
};
export type TimeBasedUuidOutput = { readonly identifiers: readonly string[] };

const gregorianOffset = 0x01b21dd213814000n;
const maximumUnixTimestampMilliseconds = 103_072_857_660_684;

const write = (
  bytes: Uint8Array,
  offset: number,
  value: bigint,
  length: number,
): void => {
  for (let index = length - 1; index >= 0; index -= 1) {
    bytes[offset + index] = Number(value & 0xffn);
    value >>= 8n;
  }
};

const nodeBytes = (
  node: string | undefined,
  random: Uint8Array,
): Uint8Array => {
  if (node) {
    return Uint8Array.from({ length: 6 }, (_, index) =>
      Number.parseInt(node.slice(index * 2, index * 2 + 2), 16),
    );
  }
  const generated = random.slice(0, 6);
  generated[0] = generated[0]! | 0x01;
  return generated;
};

const uuid = (
  version: 1 | 6,
  timestampMs: number,
  clockSequence: number,
  node: Uint8Array,
): string => {
  const timestamp = BigInt(timestampMs) * 10_000n + gregorianOffset;
  const bytes = new Uint8Array(16);
  if (version === 1) {
    write(bytes, 0, timestamp & 0xffffffffn, 4);
    write(bytes, 4, (timestamp >> 32n) & 0xffffn, 2);
    write(bytes, 6, (timestamp >> 48n) & 0x0fffn, 2);
  } else {
    write(bytes, 0, (timestamp >> 28n) & 0xffffffffn, 4);
    write(bytes, 4, (timestamp >> 12n) & 0xffffn, 2);
    write(bytes, 6, timestamp & 0x0fffn, 2);
  }
  bytes[6] = (bytes[6]! & 0x0f) | (version << 4);
  bytes[8] = ((clockSequence >> 8) & 0x3f) | 0x80;
  bytes[9] = clockSequence & 0xff;
  bytes.set(node, 10);
  return formatUuid(bytes);
};

export const calculateTimeBasedUuid = (
  input: unknown,
  version: 1 | 6,
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
  const issues: ToolIssue[] = generationIssues(
    input,
    new Set(["clockSequence", "count", "node", "seed", "timestamp"]),
  );
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
    input.clockSequence !== undefined &&
    (!Number.isInteger(input.clockSequence) ||
      (input.clockSequence as number) < 0 ||
      (input.clockSequence as number) > 16_383)
  )
    issues.push({
      code: "clock_sequence_invalid",
      field: "clockSequence",
      message: "Clock sequence must be an integer from 0 through 16,383.",
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
  if (issues.length) return invalidInput(issues);
  const count = (input.count ?? 1) as number;
  const normalizedSeed =
    input.seed === undefined
      ? undefined
      : normalizeRandomSeed(input.seed as number);
  return toolSuccess({
    identifiers: Array.from({ length: count }, (_, index) => {
      const random = randomBytes(
        8,
        normalizedSeed === undefined
          ? undefined
          : (normalizedSeed + index) >>> 0,
        context,
      );
      const baseClock =
        input.clockSequence === undefined
          ? ((random[6]! << 8) | random[7]!) & 0x3fff
          : (input.clockSequence as number);
      return uuid(
        version,
        timestamp as number,
        (baseClock + index) & 0x3fff,
        nodeBytes(input.node as string | undefined, random),
      );
    }),
  });
};

export const createTimeBasedUuidTool = (
  version: 1 | 6,
): ToolDefinition<TimeBasedUuidInput, TimeBasedUuidOutput> =>
  defineTool<TimeBasedUuidInput, TimeBasedUuidOutput>({
    contractVersion: 1,
    description:
      version === 1
        ? "Generate RFC 9562 version 1 UUIDs from a Gregorian 100-nanosecond timestamp, clock sequence, and 48-bit node identifier."
        : "Generate RFC 9562 version 6 UUIDs with the version 1 timestamp fields reordered for database-friendly lexical sorting.",
    discovery: {
      aliases: [`uuid v${version}`, `uuid${version}`],
      keywords: ["identifier", "time", "uuid"],
    },
    execute: (input, context) =>
      calculateTimeBasedUuid(input, version, context),
    execution: { kind: "pure" },
    id: `generate/uuid-v${version}`,
    inputSchema: {
      additionalProperties: false,
      properties: {
        clockSequence: { maximum: 16_383, minimum: 0, type: "integer" },
        count: { default: 1, maximum: 100, minimum: 1, type: "integer" },
        node: { pattern: "^[0-9a-fA-F]{12}$", type: "string" },
        seed: { type: "integer" },
        timestamp: {
          maximum: maximumUnixTimestampMilliseconds,
          minimum: 0,
          type: "integer",
        },
      },
      type: "object",
    },
    outputSchema: {
      additionalProperties: false,
      properties: {
        identifiers: {
          items: { format: "uuid", type: "string" },
          maxItems: 100,
          minItems: 1,
          type: "array",
        },
      },
      required: ["identifiers"],
      type: "object",
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          valueType: { format: "count", type: "integer" },
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
          id: "identifiers",
          label: "UUIDs",
          valueType: {
            format: "uuid",
            items: { format: "uuid", type: "string" },
            type: "list",
          },
        },
      ],
    },
    title: `UUID v${version} Generator`,
  });

export const createTimeBasedUuidExample = (
  version: 1 | 6,
): ToolExample<TimeBasedUuidInput, TimeBasedUuidOutput> => {
  const input = {
    clockSequence: 0x1234,
    count: 1,
    node: "aabbccddeeff",
    timestamp: 1_700_000_000_000,
  };
  const result = calculateTimeBasedUuid(input, version);
  if (!result.ok) throw new Error("Canonical UUID example must be valid.");
  return { input, output: result.output };
};
