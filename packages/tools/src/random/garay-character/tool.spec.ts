import { describe, expect, it } from "vitest";
import {
  calculateRandomGarayCharacter,
  randomGarayCharacterExample,
  randomGarayCharacterValueCount,
  runRandomGarayCharacter,
} from "./tool.js";

describe("Random Garay Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomGarayCharacter(randomGarayCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "،" } });
    expect(
      runRandomGarayCharacter(randomGarayCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐶏" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomGarayCharacterValueCount },
        (_, index) =>
          calculateRandomGarayCharacter(
            () => (index + 0.5) / randomGarayCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomGarayCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomGarayCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
