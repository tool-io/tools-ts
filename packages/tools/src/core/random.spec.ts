import { describe, expect, it } from "vitest";
import { createSeededRandom, defaultRandomSeed, randomIndex, resolveRandom } from "./random.js";

describe("portable randomness", () => {
  it("reproduces the same sequence for the same seed", () => {
    const first = createSeededRandom(42);
    const second = createSeededRandom(42);
    expect(Array.from({ length: 5 }, first)).toEqual(Array.from({ length: 5 }, second));
  });

  it("uses explicit seed, injected source, then a stable default", () => {
    expect(resolveRandom(1, { random: () => 0.9 })()).toBe(createSeededRandom(1)());
    expect(resolveRandom(undefined, { random: () => 0.25 })()).toBe(0.25);
    expect(resolveRandom(undefined)()).toBe(createSeededRandom(defaultRandomSeed)());
  });

  it("rejects invalid seeds and injected values", () => {
    expect(() => createSeededRandom(Number.NaN)).toThrow(TypeError);
    expect(() => randomIndex(2, () => 1)).toThrow(RangeError);
  });
});
