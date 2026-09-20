import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  jsonPointerNavigationExerciseExample as example,
  calculateJsonPointerNavigationExercise,
} from "./tool.js";

describe("Random JSON Pointer Navigation Exercise Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateJsonPointerNavigationExercise(example.input)).toEqual({
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
  });
  it("is immutable and reproducible, with explicit seed precedence", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
  });
  it("rejects invalid or failing injected sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
    });
  });
  it("resolves escaped slash/tilde/empty/prototype-named keys through own properties only", () => {
    const result = tool.execute({
      ...example.input,
      keys: ["a/b", "~x", "", "__proto__", "constructor"],
      queryCount: 64,
      missingProbability: 0.3,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    for (const query of result.output.queries) {
      const tokens =
        query.pointer === ""
          ? []
          : query.pointer
              .slice(1)
              .split("/")
              .map((token) =>
                token.replaceAll("~1", "/").replaceAll("~0", "~"),
              );
      let value: unknown = result.output.document,
        found = true;
      for (const token of tokens) {
        if (
          typeof value !== "object" ||
          value === null ||
          !Object.hasOwn(value, token)
        ) {
          found = false;
          break;
        }
        value = (value as Record<string, unknown>)[token];
      }
      expect(query.found).toBe(found);
      expect(query.valueJson).toBe(found ? JSON.stringify(value) : null);
    }
    expect(Object.hasOwn(Object.prototype, "polluted")).toBe(false);
  });
  it("distinguishes an actual null answer from missing and supports all primitive models", () => {
    expect(tool.execute(example.input)).toMatchObject({
      ok: true,
      output: {
        queries: [
          { found: true, valueJson: "4" },
          { found: true, valueJson: "null" },
          { found: false, valueJson: null },
          {
            pointer: "/records",
            found: true,
            valueJson: '[{"a/b":null,"~x":4},{"a/b":null,"~x":2}]',
          },
        ],
      },
    });
    const missing = tool.execute({
      ...example.input,
      missingProbability: 1,
      valueKinds: ["integer", "text", "boolean", "null"],
    });
    expect(missing.ok).toBe(true);
    if (missing.ok)
      expect(
        missing.output.queries.every(
          (query) => !query.found && query.valueJson === null,
        ),
      ).toBe(true);
  });
  it("rejects duplicate keys, invalid value bounds/probabilities, and resource excess", () => {
    for (const change of [
      { keys: ["a", "a"] },
      { recordCount: 17 },
      { queryCount: 65 },
      { minimumValue: 5 },
      { trueProbability: 1.1 },
      { missingProbability: -1 },
      { valueKinds: ["object"] },
      { textChoices: [] },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
