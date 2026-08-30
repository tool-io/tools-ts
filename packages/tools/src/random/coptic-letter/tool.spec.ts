import { describe, expect, it } from "vitest";
import {
  calculateRandomCopticLetter,
  randomCopticLetterExample,
  randomCopticLetterValueCount,
  runRandomCopticLetter,
} from "./tool.js";

describe("Random Coptic Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomCopticLetter(randomCopticLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ʹ" } });
    expect(
      runRandomCopticLetter(randomCopticLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ⳳ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomCopticLetterValueCount },
        (_, index) =>
          calculateRandomCopticLetter(
            () => (index + 0.5) / randomCopticLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomCopticLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomCopticLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
