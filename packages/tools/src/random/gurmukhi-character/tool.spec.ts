import { describe, expect, it } from "vitest";
import {
  calculateRandomGurmukhiCharacter,
  randomGurmukhiCharacterExample,
  randomGurmukhiCharacterValueCount,
  runRandomGurmukhiCharacter,
} from "./tool.js";

describe("Random Gurmukhi Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomGurmukhiCharacter(randomGurmukhiCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "॑" } });
    expect(
      runRandomGurmukhiCharacter(randomGurmukhiCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "꠹" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomGurmukhiCharacterValueCount },
        (_, index) =>
          calculateRandomGurmukhiCharacter(
            () => (index + 0.5) / randomGurmukhiCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomGurmukhiCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomGurmukhiCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
