import {
  defineTool,
  type ToolExecutionContext,
} from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { normalizeRandomSeed } from "../../core/random.js";
import {
  formatUuid,
  generationIssues,
  isRecord,
  randomBytes,
  uuidGenerationInputSchema,
  uuidGenerationOutputSchema,
  uuidGenerationPorts,
} from "../../uuid/shared.js";

export type UuidV4Input = { readonly count?: number; readonly seed?: number };
export type UuidV4Output = { readonly identifiers: readonly string[] };

const uuidV4 = (
  seed: number | undefined,
  context?: ToolExecutionContext,
): string => {
  const bytes = randomBytes(16, seed, context);
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  return formatUuid(bytes);
};

export const calculateUuidV4 = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<UuidV4Output> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const issues = generationIssues(input, new Set(["count", "seed"]));
  if (issues.length) return invalidInput(issues);
  const count = (input.count ?? 1) as number;
  const seed = input.seed as number | undefined;
  const normalizedSeed =
    seed === undefined ? undefined : normalizeRandomSeed(seed);
  return toolSuccess({
    identifiers: Array.from({ length: count }, (_, index) =>
      uuidV4(
        normalizedSeed === undefined
          ? undefined
          : (normalizedSeed + index) >>> 0,
        context,
      ),
    ),
  });
};

export const example = {
  input: { count: 2, seed: 42 },
  output: {
    identifiers: [
      "9972daab-2c86-459f-9d78-3fe1be4e3280",
      "ff46870f-10be-4b0f-a130-42daef0e7445",
    ],
  },
} satisfies ToolExample<UuidV4Input, UuidV4Output>;

export const uuidV4Tool = defineTool<UuidV4Input, UuidV4Output>({
  contractVersion: 1,
  description:
    "Generate RFC 9562 version 4 UUIDs from 122 random bits, with an optional seed for reproducible results.",
  discovery: {
    aliases: ["guid generator", "random uuid", "uuid4", "uuid v4"],
    keywords: ["guid", "identifier", "random", "uuid"],
  },
  execute: calculateUuidV4,
  execution: { kind: "pure" },
  id: "generate/uuid-v4",
  inputSchema: uuidGenerationInputSchema,
  outputSchema: uuidGenerationOutputSchema(4),
  ports: uuidGenerationPorts,
  title: "UUID v4 Generator",
});
export const runUuidV4 = uuidV4Tool.execute;
export default uuidV4Tool;
