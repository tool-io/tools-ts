import { describe, expect, it } from "vitest";
import {
  calculateRandomChamCharacter,
  randomChamCharacterExample,
  randomChamCharacterValueCount,
  runRandomChamCharacter,
} from "./tool.js";

describe("Random Cham Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomChamCharacter(randomChamCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ꨀ" } });
    expect(
      runRandomChamCharacter(randomChamCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "꩟" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomChamCharacterValueCount },
        (_, index) =>
          calculateRandomChamCharacter(
            () => (index + 0.5) / randomChamCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomChamCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomChamCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
