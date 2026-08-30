import { describe, expect, it } from "vitest";
import {
  calculateRandomKaithiCharacter,
  randomKaithiCharacterExample,
  randomKaithiCharacterValueCount,
  runRandomKaithiCharacter,
} from "./tool.js";

describe("Random Kaithi Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomKaithiCharacter(randomKaithiCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "०" } });
    expect(
      runRandomKaithiCharacter(randomKaithiCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑃂" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomKaithiCharacterValueCount },
        (_, index) =>
          calculateRandomKaithiCharacter(
            () => (index + 0.5) / randomKaithiCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomKaithiCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomKaithiCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
