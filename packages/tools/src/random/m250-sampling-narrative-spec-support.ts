import { expect, it } from "vitest";
import type {
  ToolDefinition,
  ToolExecutionContext,
} from "../core/definition.js";
import type { ToolExample } from "../core/example.js";
import type { ToolResult } from "../core/result.js";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../core/contract.js";

/** Authored contract/replay assertions; importing this helper does not register any tool. */
export const snAuthoringSpecs = <
  Input extends { readonly seed?: number },
  Output,
>(
  tool: ToolDefinition<Input, Output>,
  calculate: (
    input: unknown,
    context?: ToolExecutionContext,
  ) => ToolResult<Output>,
  example: ToolExample<Input, Output> & { readonly output: Output },
): void => {
  it("matches its frozen canonical literal directly and through the runner", () => {
    expect(calculate(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("replays seeds/defaults, gives numeric seed precedence, and preserves input", () => {
    const copy = JSON.parse(
        JSON.stringify(example.input),
      ) as typeof example.input,
      before = JSON.stringify(copy);
    expect(calculate(copy)).toEqual({ ok: true, output: example.output });
    expect(JSON.stringify(copy)).toBe(before);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Numeric seed wins");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...input } = example.input;
    expect(calculate(input)).toEqual(calculate(input));
    const contextual = calculate(input, { random: () => 0 });
    expect(contextual).toMatchObject({
      ok: true,
      output: { randomness: { seed: null, source: "context" } },
    });
    if (!contextual.ok)
      throw new Error("Expected a successful contextual generation");
    expect(matchesToolJsonSchema(contextual.output, tool.outputSchema)).toBe(
      true,
    );
  });
  it("returns specific source failures for nonfinite, out-of-range, and throwing sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [NaN, Infinity, -0.1, 1])
      expect(calculate(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("source failure");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
  it("rejects unknown, missing, inherited, sparse, accessor, and nonfinite input", () => {
    expect(calculate(null)).toMatchObject({
      ok: false,
      error: { issues: [{ code: "object_required" }] },
    });
    expect(tool.execute({})).toMatchObject({
      ok: false,
      error: {
        issues: expect.arrayContaining([
          expect.objectContaining({ code: "required_field" }),
        ]),
      },
    });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(calculate(Object.create(example.input))).toMatchObject({
      ok: false,
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "seed", code: "invalid_field" }] },
    });
    const array = Object.entries(example.input).find(([, value]) =>
      Array.isArray(value),
    );
    if (array)
      expect(
        calculate({ ...example.input, [array[0]]: Array(1) }),
      ).toMatchObject({
        ok: false,
        error: { issues: [{ field: array[0], code: "invalid_field" }] },
      });
    const accessor = Object.defineProperty({}, "seed", {
      enumerable: true,
      get: () => {
        throw new Error("Do not invoke input getters");
      },
    });
    expect(calculate(accessor)).toMatchObject({
      ok: false,
      error: { issues: [{ field: "seed", code: "invalid_field" }] },
    });
  });
};
