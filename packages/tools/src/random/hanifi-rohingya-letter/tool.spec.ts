import { describe, expect, it } from "vitest";
import {
  calculateRandomHanifiRohingyaLetter,
  randomHanifiRohingyaLetterExample,
  randomHanifiRohingyaLetterValueCount,
  runRandomHanifiRohingyaLetter,
} from "./tool.js";

describe("Random Hanifi Rohingya Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomHanifiRohingyaLetter(randomHanifiRohingyaLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ـ" } });
    expect(
      runRandomHanifiRohingyaLetter(randomHanifiRohingyaLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐴣" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomHanifiRohingyaLetterValueCount },
        (_, index) =>
          calculateRandomHanifiRohingyaLetter(
            () => (index + 0.5) / randomHanifiRohingyaLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomHanifiRohingyaLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomHanifiRohingyaLetter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
