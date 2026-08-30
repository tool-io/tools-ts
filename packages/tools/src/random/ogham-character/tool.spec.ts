import { describe, expect, it } from "vitest";
import {
  calculateRandomOghamCharacter,
  randomOghamCharacterExample,
  randomOghamCharacterValueCount,
  runRandomOghamCharacter,
} from "./tool.js";

describe("Random Ogham Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomOghamCharacter(randomOghamCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ᚁ" } });
    expect(
      runRandomOghamCharacter(randomOghamCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "᚜" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomOghamCharacterValueCount },
        (_, index) =>
          calculateRandomOghamCharacter(
            () => (index + 0.5) / randomOghamCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomOghamCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomOghamCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
