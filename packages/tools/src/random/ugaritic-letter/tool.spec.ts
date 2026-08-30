import { describe, expect, it } from "vitest";
import {
  calculateRandomUgariticLetter,
  randomUgariticLetterExample,
  randomUgariticLetterValueCount,
  runRandomUgariticLetter,
} from "./tool.js";

describe("Random Ugaritic Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomUgariticLetter(randomUgariticLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐎀" } });
    expect(
      runRandomUgariticLetter(randomUgariticLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐎝" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomUgariticLetterValueCount },
        (_, index) =>
          calculateRandomUgariticLetter(
            () => (index + 0.5) / randomUgariticLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomUgariticLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomUgariticLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
