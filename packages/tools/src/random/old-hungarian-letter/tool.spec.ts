import { describe, expect, it } from "vitest";
import {
  calculateRandomOldHungarianLetter,
  randomOldHungarianLetterExample,
  randomOldHungarianLetterValueCount,
  runRandomOldHungarianLetter,
} from "./tool.js";

describe("Random Old Hungarian Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomOldHungarianLetter(randomOldHungarianLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐲀" } });
    expect(
      runRandomOldHungarianLetter(randomOldHungarianLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐳲" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomOldHungarianLetterValueCount },
        (_, index) =>
          calculateRandomOldHungarianLetter(
            () => (index + 0.5) / randomOldHungarianLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomOldHungarianLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomOldHungarianLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
