import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";
import { resolveRandom } from "../../core/random.js";

export type SeededUuidInput = {
  /** Number of identifiers to generate, between 1 and 100. */
  readonly count?: number;
  /** Explicit seed; omit to use the injected context randomness. */
  readonly seed?: number;
};

export type SeededUuidOutput = {
  readonly identifiers: readonly string[];
};

export const seededUuidInputSchema = {
  additionalProperties: false,
  properties: {
    count: {
      description: "Number of identifiers to generate.",
      maximum: 100,
      minimum: 1,
      type: "integer",
    },
    seed: {
      description: "Explicit seed for reproducible identifiers.",
      type: "integer",
    },
  },
  type: "object",
} as const;

export const seededUuidOutputSchema = {
  additionalProperties: false,
  properties: {
    identifiers: {
      description: "Generated v4-format identifier strings.",
      items: {
        description: "Canonical UUID layout.",
        pattern:
          "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
        type: "string",
      },
      maxItems: 100,
      minItems: 1,
      type: "array",
    },
  },
  required: ["identifiers"],
  type: "object",
} as const;

export const seededUuidExample = {
  input: { count: 2, seed: 42 },
  output: {
    identifiers: [
      "97da2849-d73e-4b43-aa90-7d090402c802",
      "d7c57008-93a3-44bd-a344-1aabe1f6f210",
    ],
  },
} satisfies ToolExample<SeededUuidInput, SeededUuidOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const HEX_DIGITS = "0123456789abcdef";
const VARIANT_DIGITS = "89ab";

export const isSeededUuidOutput = (
  value: unknown,
): value is SeededUuidOutput =>
  isRecord(value) &&
  Array.isArray(value.identifiers) &&
  value.identifiers.every((id) => typeof id === "string");

const hexFor = (random: () => number, length: number): string => {
  let text = "";
  for (let index = 0; index < length; index += 1)
    text += HEX_DIGITS[Math.floor(random() * 16)];
  return text;
};

const uuidV4From = (random: () => number): string =>
  `${hexFor(random, 8)}-${hexFor(random, 4)}-4${hexFor(random, 3)}-${
    VARIANT_DIGITS[Math.floor(random() * 4)]
  }${hexFor(random, 3)}-${hexFor(random, 12)}`;

export const calculateSeededUuid = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SeededUuidOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set(["count", "seed"]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const countInput = input.count;
  const rawCount = countInput === undefined ? 1 : (countInput as number);
  if (!Number.isSafeInteger(rawCount) || rawCount < 1 || rawCount > 100)
    issues.push({
      code: "count_invalid",
      field: "count",
      message: "count must be an integer between 1 and 100.",
    });

  const seed = input.seed;
  if (seed !== undefined && !Number.isSafeInteger(seed))
    issues.push({
      code: "seed_invalid",
      field: "seed",
      message: "seed must be a safe integer.",
    });

  if (issues.length > 0) return invalidInput(issues);

  const random = resolveRandom(seed as number | undefined, context);
  const identifiers = Array.from(
    { length: rawCount as number },
    () => uuidV4From(random),
  );
  return toolSuccess({ identifiers });
};

export const seededUuidTool = defineTool<SeededUuidInput, SeededUuidOutput>({
  contractVersion: 1,
  description:
    "Generate reproducible v4-format identifiers from injected or seeded randomness.",
  discovery: {
    aliases: ["uuid-generator", "random-uuid", "guid-generator"],
    keywords: ["guid", "identifier", "random", "uuid", "v4"],
  },
  execute: calculateSeededUuid,
  execution: { kind: "pure" },
  id: "generate/seeded-uuid",
  inputSchema: seededUuidInputSchema,
  outputSchema: seededUuidOutputSchema,
  ports: {
    inputs: [
      {
        description: "Number of identifiers to generate.",
        id: "count",
        label: "Count",
        valueType: { format: "count", type: "integer" },
      },
      {
        description: "Explicit seed for reproducibility.",
        id: "seed",
        label: "Seed",
        valueType: { format: "prng-seed", type: "integer" },
      },
    ],
    outputs: [
      {
        description: "Generated v4-format identifiers.",
        id: "identifiers",
        label: "Identifiers",
        valueType: {
          format: "uuid",
          items: { format: "uuid", type: "string" },
          type: "list",
        },
      },
    ],
  },
  title: "Seeded UUID Generator",
});

export const runSeededUuid = seededUuidTool.execute;
export default seededUuidTool;
