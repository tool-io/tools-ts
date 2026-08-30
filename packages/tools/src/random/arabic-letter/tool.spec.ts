import { describe, expect, it } from "vitest";
import {
  calculateRandomArabicLetter,
  randomArabicLetterExample,
  randomArabicLetterValueCount,
  runRandomArabicLetter,
} from "./tool.js";

describe("Random Arabic Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomArabicLetter(randomArabicLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ؠ" } });
    expect(
      runRandomArabicLetter(randomArabicLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𞺻" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomArabicLetterValueCount },
        (_, index) =>
          calculateRandomArabicLetter(
            () => (index + 0.5) / randomArabicLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomArabicLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomArabicLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
