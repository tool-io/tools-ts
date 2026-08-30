import { describe, expect, it } from "vitest";
import {
  calculateRandomLydianLetter,
  randomLydianLetterExample,
  randomLydianLetterValueCount,
  runRandomLydianLetter,
} from "./tool.js";

describe("Random Lydian Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomLydianLetter(randomLydianLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐤠" } });
    expect(
      runRandomLydianLetter(randomLydianLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐤹" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomLydianLetterValueCount },
        (_, index) =>
          calculateRandomLydianLetter(
            () => (index + 0.5) / randomLydianLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomLydianLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomLydianLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
