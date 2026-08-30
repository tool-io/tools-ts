import { resolveRandom } from "../core/random.js";
import type { ToolExecutionContext } from "../core/definition.js";
import type { ToolIssue } from "../core/result.js";

export const uuidPattern =
  "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$";
export const uuidRegex = new RegExp(uuidPattern, "u");

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const randomBytes = (
  length: number,
  seed: number | undefined,
  context?: ToolExecutionContext,
): Uint8Array => {
  const random = resolveRandom(seed, context);
  return Uint8Array.from({ length }, () => Math.floor(random() * 256));
};

export const formatUuid = (bytes: Uint8Array): string => {
  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export const parseUuidBytes = (value: string): Uint8Array | null => {
  if (!uuidRegex.test(value)) return null;
  const compact = value.replaceAll("-", "");
  return Uint8Array.from({ length: 16 }, (_, index) =>
    Number.parseInt(compact.slice(index * 2, index * 2 + 2), 16),
  );
};

export const generationIssues = (
  input: Record<string, unknown>,
  fields: ReadonlySet<string>,
): ToolIssue[] => {
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!fields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not supported.`,
      });
  const count = input.count ?? 1;
  if (
    !Number.isSafeInteger(count) ||
    (count as number) < 1 ||
    (count as number) > 100
  )
    issues.push({
      code: "count_invalid",
      field: "count",
      message: "Count must be an integer from 1 through 100.",
    });
  if (input.seed !== undefined && !Number.isSafeInteger(input.seed))
    issues.push({
      code: "seed_invalid",
      field: "seed",
      message: "Seed must be a safe integer.",
    });
  return issues;
};

export const uuidGenerationPorts = {
  inputs: [
    {
      description: "Number of UUIDs to generate, from 1 through 100.",
      id: "count",
      label: "Count",
      valueType: { format: "count", type: "integer" as const },
    },
    {
      description: "Optional integer seed for reproducible output.",
      id: "seed",
      label: "Seed",
      valueType: { format: "prng-seed", type: "integer" as const },
    },
  ],
  outputs: [
    {
      description: "Generated UUIDs.",
      id: "identifiers",
      label: "UUIDs",
      valueType: {
        format: "uuid",
        items: { format: "uuid", type: "string" as const },
        type: "list" as const,
      },
    },
  ],
};

export const uuidGenerationInputSchema = {
  additionalProperties: false,
  properties: {
    count: { default: 1, maximum: 100, minimum: 1, type: "integer" },
    seed: { type: "integer" },
  },
  type: "object",
} as const;

export const uuidGenerationOutputSchema = (version: number) => ({
  additionalProperties: false,
  properties: {
    identifiers: {
      items: {
        pattern: `^[0-9a-f]{8}-[0-9a-f]{4}-${version}[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`,
        type: "string" as const,
      },
      maxItems: 100,
      minItems: 1,
      type: "array" as const,
    },
  },
  required: ["identifiers"],
  type: "object" as const,
});
