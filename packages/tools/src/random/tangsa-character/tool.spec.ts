import { describe, expect, it } from "vitest";
import {
  calculateRandomTangsaCharacter,
  randomTangsaCharacterExample,
  randomTangsaCharacterValueCount,
  runRandomTangsaCharacter,
} from "./tool.js";

describe("Random Tangsa Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomTangsaCharacter(randomTangsaCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𖩰" } });
    expect(
      runRandomTangsaCharacter(randomTangsaCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𖫉" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomTangsaCharacterValueCount },
        (_, index) =>
          calculateRandomTangsaCharacter(
            () => (index + 0.5) / randomTangsaCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTangsaCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomTangsaCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
