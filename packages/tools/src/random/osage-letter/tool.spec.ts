import { describe, expect, it } from "vitest";
import {
  calculateRandomOsageLetter,
  randomOsageLetterExample,
  randomOsageLetterValueCount,
  runRandomOsageLetter,
} from "./tool.js";

describe("Random Osage Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomOsageLetter(randomOsageLetterExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "𐒰" } });
    expect(
      runRandomOsageLetter(randomOsageLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐓻" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomOsageLetterValueCount },
        (_, index) =>
          calculateRandomOsageLetter(
            () => (index + 0.5) / randomOsageLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomOsageLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomOsageLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
