import { describe, expect, it } from "vitest";
import {
  calculateRandomRunicCharacter,
  randomRunicCharacterExample,
  randomRunicCharacterValueCount,
  runRandomRunicCharacter,
} from "./tool.js";

describe("Random Runic Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomRunicCharacter(randomRunicCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ᚠ" } });
    expect(
      runRandomRunicCharacter(randomRunicCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ᛸ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomRunicCharacterValueCount },
        (_, index) =>
          calculateRandomRunicCharacter(
            () => (index + 0.5) / randomRunicCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomRunicCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomRunicCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
