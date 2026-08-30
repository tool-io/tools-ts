import { describe, expect, it } from "vitest";
import {
  calculateRandomHebrewLetter,
  randomHebrewLetterExample,
  randomHebrewLetterValueCount,
  runRandomHebrewLetter,
} from "./tool.js";

describe("Random Hebrew Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomHebrewLetter(randomHebrewLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "א" } });
    expect(
      runRandomHebrewLetter(randomHebrewLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ﭏ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomHebrewLetterValueCount },
        (_, index) =>
          calculateRandomHebrewLetter(
            () => (index + 0.5) / randomHebrewLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomHebrewLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomHebrewLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
