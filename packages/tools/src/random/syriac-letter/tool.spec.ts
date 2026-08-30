import { describe, expect, it } from "vitest";
import {
  calculateRandomSyriacLetter,
  randomSyriacLetterExample,
  randomSyriacLetterValueCount,
  runRandomSyriacLetter,
} from "./tool.js";

describe("Random Syriac Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomSyriacLetter(randomSyriacLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ـ" } });
    expect(
      runRandomSyriacLetter(randomSyriacLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ࡪ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomSyriacLetterValueCount },
        (_, index) =>
          calculateRandomSyriacLetter(
            () => (index + 0.5) / randomSyriacLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSyriacLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomSyriacLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
