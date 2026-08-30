import { describe, expect, it } from "vitest";
import {
  calculateRandomChorasmianLetter,
  randomChorasmianLetterExample,
  randomChorasmianLetterValueCount,
  runRandomChorasmianLetter,
} from "./tool.js";

describe("Random Chorasmian Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomChorasmianLetter(randomChorasmianLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐾰" } });
    expect(
      runRandomChorasmianLetter(randomChorasmianLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐿄" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomChorasmianLetterValueCount },
        (_, index) =>
          calculateRandomChorasmianLetter(
            () => (index + 0.5) / randomChorasmianLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomChorasmianLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomChorasmianLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
