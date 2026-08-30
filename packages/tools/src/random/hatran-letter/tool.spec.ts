import { describe, expect, it } from "vitest";
import {
  calculateRandomHatranLetter,
  randomHatranLetterExample,
  randomHatranLetterValueCount,
  runRandomHatranLetter,
} from "./tool.js";

describe("Random Hatran Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomHatranLetter(randomHatranLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐣠" } });
    expect(
      runRandomHatranLetter(randomHatranLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐣵" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomHatranLetterValueCount },
        (_, index) =>
          calculateRandomHatranLetter(
            () => (index + 0.5) / randomHatranLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomHatranLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomHatranLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
