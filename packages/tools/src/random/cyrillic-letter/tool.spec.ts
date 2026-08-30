import { describe, expect, it } from "vitest";
import {
  calculateRandomCyrillicLetter,
  randomCyrillicLetterExample,
  randomCyrillicLetterValueCount,
  runRandomCyrillicLetter,
} from "./tool.js";

describe("Random Cyrillic Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomCyrillicLetter(randomCyrillicLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ʼ" } });
    expect(
      runRandomCyrillicLetter(randomCyrillicLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𞁭" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomCyrillicLetterValueCount },
        (_, index) =>
          calculateRandomCyrillicLetter(
            () => (index + 0.5) / randomCyrillicLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomCyrillicLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomCyrillicLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
