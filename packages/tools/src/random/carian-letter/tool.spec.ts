import { describe, expect, it } from "vitest";
import {
  calculateRandomCarianLetter,
  randomCarianLetterExample,
  randomCarianLetterValueCount,
  runRandomCarianLetter,
} from "./tool.js";

describe("Random Carian Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomCarianLetter(randomCarianLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐊠" } });
    expect(
      runRandomCarianLetter(randomCarianLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐋐" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomCarianLetterValueCount },
        (_, index) =>
          calculateRandomCarianLetter(
            () => (index + 0.5) / randomCarianLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomCarianLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomCarianLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
