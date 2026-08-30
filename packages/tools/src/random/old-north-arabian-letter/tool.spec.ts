import { describe, expect, it } from "vitest";
import {
  calculateRandomOldNorthArabianLetter,
  randomOldNorthArabianLetterExample,
  randomOldNorthArabianLetterValueCount,
  runRandomOldNorthArabianLetter,
} from "./tool.js";

describe("Random Old North Arabian Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomOldNorthArabianLetter(randomOldNorthArabianLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐪀" } });
    expect(
      runRandomOldNorthArabianLetter(randomOldNorthArabianLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐪜" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomOldNorthArabianLetterValueCount },
        (_, index) =>
          calculateRandomOldNorthArabianLetter(
            () => (index + 0.5) / randomOldNorthArabianLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomOldNorthArabianLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomOldNorthArabianLetter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
