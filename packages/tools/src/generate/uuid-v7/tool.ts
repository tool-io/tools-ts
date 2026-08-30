import {
  defineTool,
  type ToolExecutionContext,
} from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";
import { normalizeRandomSeed } from "../../core/random.js";
import {
  formatUuid,
  generationIssues,
  isRecord,
  randomBytes,
  uuidGenerationOutputSchema,
} from "../../uuid/shared.js";

export type UuidV7Input = {
  readonly count?: number;
  readonly seed?: number;
  readonly timestamp?: number;
};
export type UuidV7Output = { readonly identifiers: readonly string[] };

const uuidV7 = (
  timestamp: number,
  seed: number | undefined,
  context?: ToolExecutionContext,
): string => {
  const bytes = randomBytes(16, seed, context);
  let remaining = timestamp;
  for (let index = 5; index >= 0; index -= 1) {
    bytes[index] = remaining % 256;
    remaining = Math.floor(remaining / 256);
  }
  bytes[6] = (bytes[6]! & 0x0f) | 0x70;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  return formatUuid(bytes);
};

export const calculateUuidV7 = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<UuidV7Output> => {
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
    new Set(["count", "seed", "timestamp"]),
  );
  const timestamp = input.timestamp ?? context?.now?.();
  if (
    !Number.isSafeInteger(timestamp) ||
    (timestamp as number) < 0 ||
    (timestamp as number) > 281_474_976_710_655
  )
    issues.push({
      code: "timestamp_invalid",
      field: "timestamp",
      message:
        "Timestamp must be an integer Unix time in milliseconds that fits in 48 bits.",
    });
  if (issues.length) return invalidInput(issues);
  const count = (input.count ?? 1) as number;
  const seed = input.seed as number | undefined;
  const normalizedSeed =
    seed === undefined ? undefined : normalizeRandomSeed(seed);
  return toolSuccess({
    identifiers: Array.from({ length: count }, (_, index) =>
      uuidV7(
        timestamp as number,
        normalizedSeed === undefined
          ? undefined
          : (normalizedSeed + index) >>> 0,
        context,
      ),
    ),
  });
};

export const example = {
  input: { count: 1, seed: 42, timestamp: 1_700_000_000_000 },
  output: { identifiers: ["018bcfe5-6800-759f-9d78-3fe1be4e3280"] },
} satisfies ToolExample<UuidV7Input, UuidV7Output>;

export const uuidV7Tool = defineTool<UuidV7Input, UuidV7Output>({
  contractVersion: 1,
  description:
    "Generate time-ordered RFC 9562 version 7 UUIDs from a Unix millisecond timestamp and random bits.",
  discovery: {
    aliases: ["time ordered uuid", "uuid7", "uuid v7"],
    keywords: ["identifier", "timestamp", "uuid"],
  },
  execute: calculateUuidV7,
  execution: { kind: "pure" },
  id: "generate/uuid-v7",
  inputSchema: {
    additionalProperties: false,
    properties: {
      count: { default: 1, maximum: 100, minimum: 1, type: "integer" },
      seed: { type: "integer" },
      timestamp: {
        description: "Unix time in milliseconds; defaults to the current time.",
        maximum: 281_474_976_710_655,
        minimum: 0,
        type: "integer",
      },
    },
    type: "object",
  },
  outputSchema: uuidGenerationOutputSchema(7),
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
  title: "UUID v7 Generator",
});
export const runUuidV7 = uuidV7Tool.execute;
export default uuidV7Tool;
