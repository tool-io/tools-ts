import { describe, expect, it } from "vitest";
import {
  calculateRandomMroLetter,
  randomMroLetterExample,
  randomMroLetterValueCount,
  runRandomMroLetter,
} from "./tool.js";

describe("Random Mro Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMroLetter(randomMroLetterExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "𖩀" } });
    expect(
      runRandomMroLetter(randomMroLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𖩞" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMroLetterValueCount },
        (_, index) =>
          calculateRandomMroLetter(
            () => (index + 0.5) / randomMroLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMroLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMroLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
