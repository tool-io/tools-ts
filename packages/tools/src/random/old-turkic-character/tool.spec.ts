import { describe, expect, it } from "vitest";
import {
  calculateRandomOldTurkicCharacter,
  randomOldTurkicCharacterExample,
  randomOldTurkicCharacterValueCount,
  runRandomOldTurkicCharacter,
} from "./tool.js";

describe("Random Old Turkic Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomOldTurkicCharacter(randomOldTurkicCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "⁚" } });
    expect(
      runRandomOldTurkicCharacter(randomOldTurkicCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐱈" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomOldTurkicCharacterValueCount },
        (_, index) =>
          calculateRandomOldTurkicCharacter(
            () => (index + 0.5) / randomOldTurkicCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomOldTurkicCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomOldTurkicCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
