import { describe, expect, it } from "vitest";
import {
  calculateRandomLisuLetter,
  randomLisuLetterExample,
  randomLisuLetterValueCount,
  runRandomLisuLetter,
} from "./tool.js";

describe("Random Lisu Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomLisuLetter(randomLisuLetterExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "ʼ" } });
    expect(
      runRandomLisuLetter(randomLisuLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑾰" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomLisuLetterValueCount },
        (_, index) =>
          calculateRandomLisuLetter(
            () => (index + 0.5) / randomLisuLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomLisuLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomLisuLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
