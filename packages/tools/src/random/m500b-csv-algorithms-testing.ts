import { expect, it } from "vitest";
import type {
  ToolDefinition,
  ToolExecutionContext,
} from "../core/definition.js";
import type { ToolResult } from "../core/result.js";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../core/contract.js";

/** Called by each colocated spec; this file registers no tests on import. */
export const lightweightModelTests = <I extends { readonly seed?: number }, O>(
  tool: ToolDefinition<I, O>,
  calculate: (input: unknown, context?: ToolExecutionContext) => ToolResult<O>,
  fixture: { readonly input: I; readonly output: O },
): void => {
  it("lightweight canonical calculation, index runner, contract and JSON schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculate(fixture.input)).toEqual({
      ok: true,
      output: fixture.output,
    });
    expect(tool.execute(fixture.input)).toEqual({
      ok: true,
      output: fixture.output,
    });
    expect(matchesToolJsonSchema(fixture.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(fixture.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(fixture))).toEqual(fixture);
  });
  it("lightweight reports every missing field and stable malformed boundaries", () => {
    const missing = tool.execute({});
    if (missing.ok) throw new Error("Missing fields unexpectedly accepted.");
    expect(missing.error.code).toBe("invalid_input");
    expect(
      missing.error.issues.map(({ field, code }) => ({ field, code })),
    ).toEqual(
      (tool.inputSchema.required ?? []).map((field) => ({
        field,
        code: "required_field",
      })),
    );
    expect(missing.error.issues).toHaveLength(
      tool.inputSchema.required?.length ?? 0,
    );
    expect(calculate(null)).toMatchObject({
      ok: false,
      error: { issues: [{ field: "", code: "object_required" }] },
    });
    expect(calculate({ ...fixture.input, unexpected: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "unexpected", code: "unknown_field" }] },
    });
    expect(calculate({ ...fixture.input, seed: NaN })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "seed", code: "invalid_field" }] },
    });
  });
  it("lightweight immutable replay, seed precedence and advancing checked sources", () => {
    const input = JSON.parse(
      JSON.stringify(fixture.input),
    ) as typeof fixture.input;
    expect(tool.execute(input)).toEqual({ ok: true, output: fixture.output });
    expect(input).toEqual(fixture.input);
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Seed wins");
        },
      }),
    ).toEqual({ ok: true, output: fixture.output });
    const { seed: _seed, ...unseeded } = input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
    let draws = 0;
    const context = tool.execute(unseeded, {
      random: () => {
        draws += 1;
        return 0;
      },
    });
    if (!context.ok)
      throw new Error(
        "Zero source should be valid: " + JSON.stringify(context.error),
      );
    expect(draws).toBeGreaterThan(0);
    expect(context.output).toMatchObject({
      randomness: { source: "context", seed: null },
    });
    expect(matchesToolJsonSchema(context.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(context.output))).toEqual(context.output);
    for (const random of [
      () => -0.1,
      () => NaN,
      () => Infinity,
      () => 1,
      () => {
        throw new Error("Unavailable");
      },
    ])
      expect(calculate(unseeded, { random })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
  });
  it("lightweight replays one advancing alternating context stream exactly", () => {
    const { seed: _seed, ...input } = fixture.input;
    const source = () => {
      let draws = 0;
      return {
        random: () => {
          draws += 1;
          return draws % 2 ? 0.2 : 0.7;
        },
        count: () => draws,
      };
    };
    const first = source(),
      second = source();
    const result = calculate(input, first);
    if (!result.ok)
      throw new Error(
        "Expected checked alternating context success: " +
          JSON.stringify(result.error),
      );
    expect(calculate(input, second)).toEqual(result);
    expect(first.count()).toBeGreaterThan(0);
    expect(first.count()).toBe(second.count());
    expect(matchesToolJsonSchema(result.output, tool.outputSchema)).toBe(true);
  });
};
