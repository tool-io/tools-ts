import { describe, expect, it } from "vitest";
import {
  calculateRandomCaucasianAlbanianLetter,
  randomCaucasianAlbanianLetterExample,
  randomCaucasianAlbanianLetterValueCount,
  runRandomCaucasianAlbanianLetter,
} from "./tool.js";

describe("Random Caucasian Albanian Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomCaucasianAlbanianLetter(
        randomCaucasianAlbanianLetterExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "𐔰" } });
    expect(
      runRandomCaucasianAlbanianLetter(
        randomCaucasianAlbanianLetterExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "𐕣" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomCaucasianAlbanianLetterValueCount },
        (_, index) =>
          calculateRandomCaucasianAlbanianLetter(
            () => (index + 0.5) / randomCaucasianAlbanianLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomCaucasianAlbanianLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomCaucasianAlbanianLetter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
