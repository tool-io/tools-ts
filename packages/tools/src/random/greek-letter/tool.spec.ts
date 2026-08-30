import { describe, expect, it } from "vitest";
import {
  calculateRandomGreekLetter,
  randomGreekLetterExample,
  randomGreekLetterValueCount,
  runRandomGreekLetter,
} from "./tool.js";

describe("Random Greek Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomGreekLetter(randomGreekLetterExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "Ͱ" } });
    expect(
      runRandomGreekLetter(randomGreekLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𝿴" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomGreekLetterValueCount },
        (_, index) =>
          calculateRandomGreekLetter(
            () => (index + 0.5) / randomGreekLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomGreekLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomGreekLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
