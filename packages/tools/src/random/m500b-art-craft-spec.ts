import { expect, it } from "vitest";
import type { ToolDefinition } from "../core/definition.js";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../core/contract.js";
import type { AcSeed, AcReplay } from "./m500b-art-craft-common.js";
/** Registers tests only when explicitly called by a colocated spec. */
export const craftSpec = <I extends AcSeed, O extends AcReplay>(
  tool: ToolDefinition<I, O>,
  example: { readonly input: I; readonly output: O },
  calculate: ToolDefinition<I, O>["execute"],
): void => {
  it("lightweight canonical direct, index runner, schema and JSON contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    const expected = { ok: true, output: example.output };
    expect(calculate(example.input)).toEqual(expected);
    expect(tool.execute(example.input)).toEqual(expected);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("lightweight complete missing-field and malformed-field diagnostics", () => {
    const missing = tool.execute({});
    if (missing.ok) throw new Error("Expected required-field failure");
    expect(missing.error.issues.map((i) => [i.field, i.code])).toEqual(
      (tool.inputSchema.required ?? []).map((field) => [
        field,
        "required_field",
      ]),
    );
    expect(missing.error.issues).toHaveLength(
      tool.inputSchema.required?.length ?? 0,
    );
    expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "seed", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, checked context and immutability", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(input).toEqual(example.input);
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
    const contextual = tool.execute(unseeded, { random: () => 0 });
    if (!contextual.ok) throw new Error("Expected valid context construction");
    expect(contextual.output.randomness).toEqual({
      seed: null,
      source: "context",
    });
    expect(matchesToolJsonSchema(contextual.output, tool.outputSchema)).toBe(
      true,
    );
    for (const value of [1, NaN])
      expect(tool.execute(unseeded, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(unseeded, {
        random: () => {
          throw new Error("source");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
};
