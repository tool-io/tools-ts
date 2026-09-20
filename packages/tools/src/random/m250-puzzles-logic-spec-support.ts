import { expect, it } from "vitest";
import type {
  ToolDefinition,
  ToolExecutionContext,
} from "../core/definition.js";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../core/contract.js";
import type { ToolResult } from "../core/result.js";

/** Shared assertions for the explicitly scoped puzzle/logic specifications. */
export const puzzleContractSpecs = <I extends { readonly seed?: number }, O>(
  tool: ToolDefinition<I, O>,
  example: { readonly input: I; readonly output: O },
  calculate: (input: I, context?: ToolExecutionContext) => ToolResult<O>,
): void => {
  it("publishes concrete portable ports, schemas, and an independently fixed canonical result", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(calculate(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(Object.isFrozen(example)).toBe(true);
    expect(Object.isFrozen(example.input)).toBe(true);
    expect(Object.isFrozen(example.output)).toBe(true);
  });
  it("replays without mutation and gives an explicit seed precedence over context", () => {
    const before = JSON.stringify(example.input);
    expect(calculate(example.input)).toEqual(calculate(example.input));
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Explicit seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    expect(JSON.stringify(example.input)).toBe(before);
    const { seed: ignoredSeed, ...unseeded } = example.input;
    expect(ignoredSeed).toBe(42);
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
    const contextual = tool.execute(unseeded, { random: () => 0.25 });
    expect(contextual).toMatchObject({
      ok: true,
      output: { randomness: { seed: null, source: "context" } },
    });
    if (!contextual.ok)
      throw new Error("Valid contextual draws should succeed");
    expect(matchesToolJsonSchema(contextual.output, tool.outputSchema)).toBe(
      true,
    );
  });
  it("reports invalid and throwing injected sources, and rejects malformed JSON inputs", () => {
    const { seed: ignoredSeed, ...unseeded } = example.input;
    expect(ignoredSeed).toBe(42);
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(unseeded, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(unseeded, {
        random: () => {
          throw new Error("source failure");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
    expect(tool.execute(null)).toMatchObject({
      ok: false,
      error: { issues: [{ code: "object_required" }] },
    });
    const missing = tool.execute({});
    expect(missing.ok).toBe(false);
    if (missing.ok)
      throw new Error(
        "An empty input must report every missing required field",
      );
    const requiredIssues = (tool.inputSchema.required ?? []).map((field) => ({
      field,
      code: "required_field",
    }));
    expect(missing.error.code).toBe("invalid_input");
    expect(missing.error.issues).toHaveLength(requiredIssues.length);
    expect(
      missing.error.issues.map(({ field, code }) => ({ field, code })),
    ).toEqual(expect.arrayContaining(requiredIssues));
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: Infinity })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "seed", code: "invalid_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: 0.25 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "seed", code: "invalid_field" }] },
    });
  });
};
