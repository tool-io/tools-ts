import { describe, expect, it } from "vitest";
import {
  calculateRandomArmenianLetter,
  randomArmenianLetterExample,
  randomArmenianLetterValueCount,
  runRandomArmenianLetter,
} from "./tool.js";

describe("Random Armenian Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomArmenianLetter(randomArmenianLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "Ա" } });
    expect(
      runRandomArmenianLetter(randomArmenianLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ﬗ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomArmenianLetterValueCount },
        (_, index) =>
          calculateRandomArmenianLetter(
            () => (index + 0.5) / randomArmenianLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomArmenianLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomArmenianLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
