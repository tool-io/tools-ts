import { describe, expect, it } from "vitest";
import { createSeededRandom, defaultRandomSeed } from "../core/random.js";
import { SimpleToolError } from "../core/simple.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorSampleIndices,
} from "./generator-random.js";

describe("shared generator randomness", () => {
  it("delegates the numeric seed to core and keeps a single advancing source", () => {
    const expected = createSeededRandom(42),
      random = createGeneratorRandom(42, {
        random: () => {
          throw new Error("Seed must win");
        },
      });
    expect(random.unit()).toBe(expected());
    expect(random.unit()).toBe(expected());
    expect(random.unit()).toBe(expected());
    const fallback = createGeneratorRandom(),
      reference = createSeededRandom(defaultRandomSeed);
    expect(fallback.unit()).toBe(reference());
    expect(fallback.unit()).toBe(reference());
  });
  it("reuses integer generation, inclusive bounds and uniform index selection", () => {
    expect(
      createGeneratorRandom(undefined, { random: () => 0 }).integer(-3, 5),
    ).toBe(-3);
    expect(
      createGeneratorRandom(undefined, {
        random: () => 1 - Number.EPSILON,
      }).integer(-3, 5),
    ).toBe(5);
    expect(
      createGeneratorRandom(undefined, { random: () => 0.75 }).pick(["a", "b"]),
    ).toBe("b");
  });
  it("implements a hand-replayed Fisher-Yates shuffle without mutating the caller", () => {
    const input = ["a", "b", "c"];
    let calls = 0;
    const random = createGeneratorRandom(undefined, {
      random: () => {
        calls += 1;
        return 0;
      },
    });
    expect(random.shuffle(input)).toEqual(["b", "c", "a"]);
    expect(input).toEqual(["a", "b", "c"]);
    expect(calls).toBe(2);
  });
  it("records normalized seeds and distinguishes nonreplayable injected context", () => {
    expect(generatorReplay(-1)).toEqual({ seed: 4294967295, source: "seed" });
    expect(generatorReplay()).toEqual({
      seed: defaultRandomSeed,
      source: "seed",
    });
    expect(generatorReplay(undefined, { random: () => 0 })).toEqual({
      seed: null,
      source: "context",
    });
    expect(generatorReplay(7, { random: () => 0 })).toEqual({
      seed: 7,
      source: "seed",
    });
  });
  it("samples virtual populations without replacement or materializing the population", () => {
    const random = createGeneratorRandom(undefined, { random: () => 0 });
    expect(generatorSampleIndices(4, 4, random)).toEqual([0, 3, 2, 1]);
    expect(generatorSampleIndices(0, 0, random)).toEqual([]);
    const large = generatorSampleIndices(
      4294967296,
      5,
      createGeneratorRandom(42),
    );
    expect(new Set(large).size).toBe(5);
    for (const index of large) {
      expect(Number.isSafeInteger(index)).toBe(true);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(4294967296);
    }
    expect(() => generatorSampleIndices(2, 3, random)).toThrowError(
      expect.objectContaining({ field: "count", code: "invalid_sample_size" }),
    );
  });
  it("rejects every invalid draw and catches only the injected source failure", () => {
    for (const value of [-0.01, 1, NaN, Infinity]) {
      const random = createGeneratorRandom(undefined, { random: () => value });
      expect(() => random.unit()).toThrowError(
        expect.objectContaining({
          code: "invalid_random_source",
          field: "random",
        }),
      );
    }
    expect(() =>
      createGeneratorRandom(undefined, {
        random: () => {
          throw new Error("Provider failure");
        },
      }).unit(),
    ).toThrowError(
      expect.objectContaining({
        code: "invalid_random_source",
        field: "random",
      }),
    );
    for (const seed of [NaN, Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1])
      expect(() => createGeneratorRandom(seed)).toThrowError(
        expect.objectContaining({ code: "invalid_seed", field: "seed" }),
      );
  });
  it("returns only documented structured model failures and preserves programming exceptions", () => {
    expect(
      generatorFailure(
        new SimpleToolError("count", "Bad count", "invalid_count"),
      ),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_count", field: "count" }] },
    });
    const failure = new Error("Programming failure");
    expect(() => generatorFailure(failure)).toThrow(failure);
  });
});
