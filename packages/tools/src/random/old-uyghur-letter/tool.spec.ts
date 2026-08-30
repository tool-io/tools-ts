import { describe, expect, it } from "vitest";
import {
  calculateRandomOldUyghurLetter,
  randomOldUyghurLetterExample,
  randomOldUyghurLetterValueCount,
  runRandomOldUyghurLetter,
} from "./tool.js";

describe("Random Old Uyghur Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomOldUyghurLetter(randomOldUyghurLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ـ" } });
    expect(
      runRandomOldUyghurLetter(randomOldUyghurLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐾁" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomOldUyghurLetterValueCount },
        (_, index) =>
          calculateRandomOldUyghurLetter(
            () => (index + 0.5) / randomOldUyghurLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomOldUyghurLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomOldUyghurLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
