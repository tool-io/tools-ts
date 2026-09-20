import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  countingBloomFilterWorkloadExample as example,
  calculateCountingBloomFilterWorkload,
} from "./tool.js";

describe("Random Counting Bloom Filter Workload Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateCountingBloomFilterWorkload(example.input)).toEqual({
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
  it("removes only available occurrences and never underestimates true retained multiplicity", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        ...example.input,
        insertCount: 30,
        removalCount: 20,
        queryCount: 40,
        seed,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      const counts = new Map<string, number>();
      for (const value of result.output.inserted)
        counts.set(value, (counts.get(value) ?? 0) + 1);
      for (const value of result.output.removed) {
        expect(counts.get(value)).toBeGreaterThan(0);
        counts.set(value, counts.get(value)! - 1);
      }
      expect([...counts.values()].reduce((sum, count) => sum + count, 0)).toBe(
        10,
      );
      for (const query of result.output.queries) {
        expect(query.exactMultiplicity).toBe(counts.get(query.query) ?? 0);
        expect(query.estimatedMultiplicity).toBeGreaterThanOrEqual(
          query.exactMultiplicity,
        );
        if (query.exactMultiplicity > 0)
          expect(query.possiblyPresent).toBe(true);
      }
      expect(result.output.filter.successfulRemovals).toBe(20);
    }
  });
  it("supports empty and fully removed filters, duplicate universes, and inherited-property item names", () => {
    for (const insertCount of [0, 10]) {
      const result = tool.execute({
        ...example.input,
        universe: ["__proto__", "constructor", "__proto__"],
        insertCount,
        removalCount: insertCount,
      });
      expect(result).toMatchObject({
        ok: true,
        output: {
          remainingMultiplicities: [],
          filter: { nonzeroCounters: 0 },
          summary: { positiveQueryCount: 0, falsePositiveCount: 0 },
        },
      });
      if (result.ok)
        expect(
          result.output.queries.every(
            (query) =>
              query.exactMultiplicity === 0 &&
              query.estimatedMultiplicity === 0 &&
              !query.possiblyPresent,
          ),
        ).toBe(true);
    }
  });
  it("rejects impossible removals, invalid dimensions, and excessive delegated work", () => {
    for (const change of [
      { removalCount: 6 },
      { counterCount: 7 },
      { hashCount: 17 },
      { queryCount: 129 },
      { insertCount: -1 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
    expect(
      tool.execute({
        ...example.input,
        universe: ["x".repeat(64)],
        insertCount: 512,
        removalCount: 512,
        queryCount: 128,
        counterCount: 65536,
        hashCount: 16,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "resource_limit" }] },
    });
  });
});
