import { describe, expect, it } from "vitest";
import {
  calculateRandomDeseretLetter,
  randomDeseretLetterExample,
  randomDeseretLetterValueCount,
  runRandomDeseretLetter,
} from "./tool.js";

describe("Random Deseret Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomDeseretLetter(randomDeseretLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐐀" } });
    expect(
      runRandomDeseretLetter(randomDeseretLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐑏" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomDeseretLetterValueCount },
        (_, index) =>
          calculateRandomDeseretLetter(
            () => (index + 0.5) / randomDeseretLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomDeseretLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomDeseretLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
