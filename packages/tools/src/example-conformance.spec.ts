import { describe, expect, it } from "vitest";
import manifest from "../public-tools.generated.json" with { type: "json" };
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "./core/contract.js";
import type { ToolJsonSchema } from "./core/definition.js";
import type { ToolResult } from "./core/result.js";
import { exampleOutputsMatch } from "./core/example.js";

type ToolModule = {
  readonly default: {
    readonly id: string;
    readonly inputSchema: ToolJsonSchema;
    readonly outputSchema: ToolJsonSchema;
    readonly execute: (input: unknown) => ToolResult<unknown>;
  };
  readonly example?: {
    readonly input: unknown;
    readonly output?: unknown;
  };
};

const moduleLoaders = (
  import.meta as unknown as {
    glob<T>(pattern: string): Record<string, () => Promise<T>>;
  }
).glob<ToolModule>("./**/index.ts");

const batchSize = 100;
const toolBatches = Array.from(
  { length: Math.ceil(manifest.tools.length / batchSize) },
  (_, index) => {
    const start = index * batchSize;
    const directories = manifest.tools.slice(start, start + batchSize);
    return {
      directories,
      range: `${start + 1}-${start + directories.length}`,
    };
  },
);

describe("authored examples", () => {
  it.each(toolBatches)(
    "match source execution for tools $range",
    async ({ directories }) => {
      const errors: string[] = [];
      for (const directory of directories) {
        const load = moduleLoaders[`./${directory}/index.ts`];
        if (!load) {
          errors.push(`${directory}: source module is missing`);
          continue;
        }
        const module = await load();
        const contractIssues = validateToolContract(module.default);
        if (contractIssues.length > 0)
          errors.push(
            `${directory}: ${contractIssues.map((issue) => issue.code).join(", ")}`,
          );
        if (module.example === undefined) {
          errors.push(`${directory}: canonical example is missing`);
          continue;
        }
        if (
          !matchesToolJsonSchema(
            module.example.input,
            module.default.inputSchema,
          )
        ) {
          errors.push(`${directory}: example input differs from its schema`);
          continue;
        }
        const result = module.default.execute(module.example.input);
        if (!result.ok) {
          errors.push(`${directory}: example execution failed`);
          continue;
        }
        if (
          Object.hasOwn(module.example, "output") &&
          !exampleOutputsMatch(result.output, module.example.output)
        )
          errors.push(`${directory}: example output differs from execution`);
        if (!matchesToolJsonSchema(result.output, module.default.outputSchema))
          errors.push(`${directory}: example output differs from its schema`);
      }
      expect(errors).toEqual([]);
    },
    15_000,
  );
});
