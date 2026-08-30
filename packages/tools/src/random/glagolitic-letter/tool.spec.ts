import { describe, expect, it } from "vitest";
import {
  calculateRandomGlagoliticLetter,
  randomGlagoliticLetterExample,
  randomGlagoliticLetterValueCount,
  runRandomGlagoliticLetter,
} from "./tool.js";

describe("Random Glagolitic Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomGlagoliticLetter(randomGlagoliticLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "Ⰰ" } });
    expect(
      runRandomGlagoliticLetter(randomGlagoliticLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ⱟ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomGlagoliticLetterValueCount },
        (_, index) =>
          calculateRandomGlagoliticLetter(
            () => (index + 0.5) / randomGlagoliticLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomGlagoliticLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomGlagoliticLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
