import { describe, expect, it } from "vitest";
import manifest from "../public-tools.generated.json" with { type: "json" };
import type { ToolResult } from "./core/result.js";

type ToolModule = {
  readonly default: {
    readonly id: string;
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

const deepEqual = (left: unknown, right: unknown): boolean => {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) || Array.isArray(right))
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((value, index) => deepEqual(value, right[index]))
    );
  if (
    typeof left !== "object" ||
    left === null ||
    typeof right !== "object" ||
    right === null
  )
    return false;
  const leftRecord = left as Record<string, unknown>;
  const rightRecord = right as Record<string, unknown>;
  const keys = Object.keys(leftRecord);
  return (
    keys.length === Object.keys(rightRecord).length &&
    keys.every(
      (key) =>
        Object.hasOwn(rightRecord, key) &&
        deepEqual(leftRecord[key], rightRecord[key]),
    )
  );
};

describe("authored examples", () => {
  it("match their source tool execution results", async () => {
    const errors: string[] = [];
    for (const directory of manifest.tools) {
      const load = moduleLoaders[`./${directory}/index.ts`];
      if (!load) {
        errors.push(`${directory}: source module is missing`);
        continue;
      }
      const module = await load();
      if (module.example === undefined) continue;
      const result = module.default.execute(module.example.input);
      if (!result.ok) {
        errors.push(`${directory}: example execution failed`);
        continue;
      }
      if (
        Object.hasOwn(module.example, "output") &&
        !deepEqual(result.output, module.example.output)
      )
        errors.push(`${directory}: example output differs from execution`);
    }
    expect(errors).toEqual([]);
  }, 30_000);
});
