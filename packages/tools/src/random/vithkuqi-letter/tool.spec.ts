import { describe, expect, it } from "vitest";
import {
  calculateRandomVithkuqiLetter,
  randomVithkuqiLetterExample,
  randomVithkuqiLetterValueCount,
  runRandomVithkuqiLetter,
} from "./tool.js";

describe("Random Vithkuqi Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomVithkuqiLetter(randomVithkuqiLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐕰" } });
    expect(
      runRandomVithkuqiLetter(randomVithkuqiLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐖼" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomVithkuqiLetterValueCount },
        (_, index) =>
          calculateRandomVithkuqiLetter(
            () => (index + 0.5) / randomVithkuqiLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomVithkuqiLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomVithkuqiLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
