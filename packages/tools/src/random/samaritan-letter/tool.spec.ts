import { describe, expect, it } from "vitest";
import {
  calculateRandomSamaritanLetter,
  randomSamaritanLetterExample,
  randomSamaritanLetterValueCount,
  runRandomSamaritanLetter,
} from "./tool.js";

describe("Random Samaritan Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomSamaritanLetter(randomSamaritanLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ࠀ" } });
    expect(
      runRandomSamaritanLetter(randomSamaritanLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ࠨ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomSamaritanLetterValueCount },
        (_, index) =>
          calculateRandomSamaritanLetter(
            () => (index + 0.5) / randomSamaritanLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSamaritanLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomSamaritanLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
