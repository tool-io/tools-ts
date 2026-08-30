import { describe, expect, it } from "vitest";
import {
  calculateRandomRomanNumeral,
  randomRomanNumeralExample,
  randomRomanNumeralValueCount,
  runRandomRomanNumeral,
} from "./tool.js";

describe("Random Roman Numeral Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomRomanNumeral(randomRomanNumeralExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "Ⅰ" } });
    expect(
      runRandomRomanNumeral(randomRomanNumeralExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ↈ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomRomanNumeralValueCount },
        (_, index) =>
          calculateRandomRomanNumeral(
            () => (index + 0.5) / randomRomanNumeralValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomRomanNumeralValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomRomanNumeral({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
