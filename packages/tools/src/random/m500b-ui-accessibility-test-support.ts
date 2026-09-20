import { expect } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../core/contract.js";
import type {
  ToolDefinition,
  ToolExecutionContext,
} from "../core/definition.js";
import type { ToolResult } from "../core/result.js";

// Assertion functions only: importing this file registers no tests.
export const canonical = <I, O>(
  tool: ToolDefinition<I, O>,
  calculate: (input: unknown, context?: ToolExecutionContext) => ToolResult<O>,
  example: { readonly input: I; readonly output: O },
): void => {
  expect(validateToolContract(tool)).toEqual([]);
  expect(calculate(example.input)).toEqual({
    ok: true,
    output: example.output,
  });
  expect(tool.execute(example.input)).toEqual({
    ok: true,
    output: example.output,
  });
  expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
  expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  expect(JSON.parse(JSON.stringify(example))).toEqual(example);
};
export const boundaries = <I, O>(
  tool: ToolDefinition<I, O>,
  input: I,
): void => {
  const result = tool.execute({});
  if (result.ok) throw new Error("Missing fields unexpectedly accepted.");
  const required = tool.inputSchema.required ?? [];
  expect(
    result.error.issues.map(({ field, code }) => ({ field, code })),
  ).toEqual(required.map((field) => ({ field, code: "required_field" })));
  expect(result.error.issues).toHaveLength(required.length);
  expect(tool.execute(null)).toMatchObject({
    ok: false,
    error: { issues: [{ field: "", code: "object_required" }] },
  });
  expect(tool.execute({ ...input, extra: true })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "extra", code: "unknown_field" }] },
  });
  expect(tool.execute({ ...input, seed: Infinity })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "seed", code: "invalid_field" }] },
  });
};
export const replay = <I extends { readonly seed?: number }, O>(
  tool: ToolDefinition<I, O>,
  input: I,
): void => {
  const copy = JSON.parse(JSON.stringify(input)) as typeof input;
  expect(tool.execute(copy)).toEqual(tool.execute(input));
  expect(copy).toEqual(input);
  expect(
    tool.execute(input, {
      random: () => {
        throw new Error("Explicit seed must win");
      },
    }),
  ).toEqual(tool.execute(input));
  const { seed, ...unseeded } = input;
  expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
  for (const source of [
    () => 1,
    () => NaN,
    () => {
      throw new Error("Source failed");
    },
  ])
    expect(tool.execute(unseeded, { random: source })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
};
