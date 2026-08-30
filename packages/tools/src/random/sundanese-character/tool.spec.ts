import { describe, expect, it } from "vitest";
import {
  calculateRandomSundaneseCharacter,
  randomSundaneseCharacterExample,
  randomSundaneseCharacterValueCount,
  runRandomSundaneseCharacter,
} from "./tool.js";

describe("Random Sundanese Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomSundaneseCharacter(randomSundaneseCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ᮀ" } });
    expect(
      runRandomSundaneseCharacter(randomSundaneseCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "᳇" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomSundaneseCharacterValueCount },
        (_, index) =>
          calculateRandomSundaneseCharacter(
            () => (index + 0.5) / randomSundaneseCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSundaneseCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomSundaneseCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
