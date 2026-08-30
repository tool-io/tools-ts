import { describe, expect, it } from "vitest";
import {
  calculateRandomYezidiLetter,
  randomYezidiLetterExample,
  randomYezidiLetterValueCount,
  runRandomYezidiLetter,
} from "./tool.js";

describe("Random Yezidi Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomYezidiLetter(randomYezidiLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐺀" } });
    expect(
      runRandomYezidiLetter(randomYezidiLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐺱" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomYezidiLetterValueCount },
        (_, index) =>
          calculateRandomYezidiLetter(
            () => (index + 0.5) / randomYezidiLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomYezidiLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomYezidiLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
