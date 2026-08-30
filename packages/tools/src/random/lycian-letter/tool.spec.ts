import { describe, expect, it } from "vitest";
import {
  calculateRandomLycianLetter,
  randomLycianLetterExample,
  randomLycianLetterValueCount,
  runRandomLycianLetter,
} from "./tool.js";

describe("Random Lycian Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomLycianLetter(randomLycianLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐊀" } });
    expect(
      runRandomLycianLetter(randomLycianLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐊜" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomLycianLetterValueCount },
        (_, index) =>
          calculateRandomLycianLetter(
            () => (index + 0.5) / randomLycianLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomLycianLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomLycianLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
