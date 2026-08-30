import { describe, expect, it } from "vitest";
import {
  calculateRandomOldSouthArabianLetter,
  randomOldSouthArabianLetterExample,
  randomOldSouthArabianLetterValueCount,
  runRandomOldSouthArabianLetter,
} from "./tool.js";

describe("Random Old South Arabian Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomOldSouthArabianLetter(randomOldSouthArabianLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐩠" } });
    expect(
      runRandomOldSouthArabianLetter(randomOldSouthArabianLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐩼" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomOldSouthArabianLetterValueCount },
        (_, index) =>
          calculateRandomOldSouthArabianLetter(
            () => (index + 0.5) / randomOldSouthArabianLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomOldSouthArabianLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomOldSouthArabianLetter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
