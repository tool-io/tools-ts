import { describe, expect, it } from "vitest";
import {
  calculateRandomJapaneseSignSyllable,
  randomJapaneseSignSyllableExample,
  randomJapaneseSignSyllableValueCount,
  runRandomJapaneseSignSyllable,
} from "./tool.js";

describe("Random Japanese Sign Syllable Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomJapaneseSignSyllable(randomJapaneseSignSyllableExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "あ" } });
    expect(
      runRandomJapaneseSignSyllable(randomJapaneseSignSyllableExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ん" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomJapaneseSignSyllableValueCount },
        (_, index) =>
          calculateRandomJapaneseSignSyllable(
            () => (index + 0.5) / randomJapaneseSignSyllableValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomJapaneseSignSyllableValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomJapaneseSignSyllable({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
