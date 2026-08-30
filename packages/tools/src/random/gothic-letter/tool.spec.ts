import { describe, expect, it } from "vitest";
import {
  calculateRandomGothicLetter,
  randomGothicLetterExample,
  randomGothicLetterValueCount,
  runRandomGothicLetter,
} from "./tool.js";

describe("Random Gothic Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomGothicLetter(randomGothicLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐌰" } });
    expect(
      runRandomGothicLetter(randomGothicLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐍉" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomGothicLetterValueCount },
        (_, index) =>
          calculateRandomGothicLetter(
            () => (index + 0.5) / randomGothicLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomGothicLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomGothicLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
