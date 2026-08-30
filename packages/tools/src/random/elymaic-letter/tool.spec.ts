import { describe, expect, it } from "vitest";
import {
  calculateRandomElymaicLetter,
  randomElymaicLetterExample,
  randomElymaicLetterValueCount,
  runRandomElymaicLetter,
} from "./tool.js";

describe("Random Elymaic Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomElymaicLetter(randomElymaicLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐿠" } });
    expect(
      runRandomElymaicLetter(randomElymaicLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐿶" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomElymaicLetterValueCount },
        (_, index) =>
          calculateRandomElymaicLetter(
            () => (index + 0.5) / randomElymaicLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomElymaicLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomElymaicLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
