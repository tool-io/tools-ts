import { describe, expect, it } from "vitest";
import {
  calculateRandomOldSogdianLetter,
  randomOldSogdianLetterExample,
  randomOldSogdianLetterValueCount,
  runRandomOldSogdianLetter,
} from "./tool.js";

describe("Random Old Sogdian Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomOldSogdianLetter(randomOldSogdianLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐼀" } });
    expect(
      runRandomOldSogdianLetter(randomOldSogdianLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐼧" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomOldSogdianLetterValueCount },
        (_, index) =>
          calculateRandomOldSogdianLetter(
            () => (index + 0.5) / randomOldSogdianLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomOldSogdianLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomOldSogdianLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
