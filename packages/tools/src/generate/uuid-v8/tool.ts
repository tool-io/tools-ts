import {
  defineTool,
  type ToolExecutionContext,
} from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { normalizeRandomSeed } from "../../core/random.js";
import { invalidInput, toolSuccess } from "../../core/result.js";
import {
  formatUuid,
  generationIssues,
  isRecord,
  randomBytes,
  uuidGenerationInputSchema,
  uuidGenerationOutputSchema,
  uuidGenerationPorts,
} from "../../uuid/shared.js";

export const calculateUuidV8 = (
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
  const issues = generationIssues(input, new Set(["count", "seed"]));
  if (issues.length) return invalidInput(issues);
  const count = (input.count ?? 1) as number;
  const seed =
    input.seed === undefined
      ? undefined
      : normalizeRandomSeed(input.seed as number);
  return toolSuccess({
    identifiers: Array.from({ length: count }, (_, index) => {
      const bytes = randomBytes(
        16,
        seed === undefined ? undefined : (seed + index) >>> 0,
        context,
      );
      bytes[6] = (bytes[6]! & 0x0f) | 0x80;
      bytes[8] = (bytes[8]! & 0x3f) | 0x80;
      return formatUuid(bytes);
    }),
  });
};

export const example = {
  input: { count: 1, seed: 42 },
  output: { identifiers: ["9972daab-2c86-859f-9d78-3fe1be4e3280"] },
} satisfies ToolExample<
  { readonly count?: number; readonly seed?: number },
  { readonly identifiers: readonly string[] }
>;

export const uuidV8Tool = defineTool({
  contractVersion: 1,
  description:
    "Generate RFC 9562 version 8 UUIDs with application-defined random payload bits while preserving the version and RFC variant fields.",
  discovery: {
    aliases: ["custom uuid", "uuid v8", "uuid8"],
    keywords: ["custom", "identifier", "uuid"],
  },
  execute: calculateUuidV8,
  execution: { kind: "pure" },
  id: "generate/uuid-v8",
  inputSchema: uuidGenerationInputSchema,
  outputSchema: uuidGenerationOutputSchema(8),
  ports: uuidGenerationPorts,
  title: "UUID v8 Generator",
});
export const runUuidV8 = uuidV8Tool.execute;
export default uuidV8Tool;
