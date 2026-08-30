import { describe, expect, it } from "vitest";
import {
  calculateRandomJavaneseCharacter,
  randomJavaneseCharacterExample,
  randomJavaneseCharacterValueCount,
  runRandomJavaneseCharacter,
} from "./tool.js";

describe("Random Javanese Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomJavaneseCharacter(randomJavaneseCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ꦀ" } });
    expect(
      runRandomJavaneseCharacter(randomJavaneseCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "꧟" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomJavaneseCharacterValueCount },
        (_, index) =>
          calculateRandomJavaneseCharacter(
            () => (index + 0.5) / randomJavaneseCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomJavaneseCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomJavaneseCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
