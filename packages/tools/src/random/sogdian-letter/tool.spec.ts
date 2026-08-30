import { describe, expect, it } from "vitest";
import {
  calculateRandomSogdianLetter,
  randomSogdianLetterExample,
  randomSogdianLetterValueCount,
  runRandomSogdianLetter,
} from "./tool.js";

describe("Random Sogdian Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomSogdianLetter(randomSogdianLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ـ" } });
    expect(
      runRandomSogdianLetter(randomSogdianLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐽅" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomSogdianLetterValueCount },
        (_, index) =>
          calculateRandomSogdianLetter(
            () => (index + 0.5) / randomSogdianLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSogdianLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomSogdianLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
