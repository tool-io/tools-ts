import { describe, expect, it } from "vitest";
import {
  calculateRandomKayahLiCharacter,
  randomKayahLiCharacterExample,
  randomKayahLiCharacterValueCount,
  runRandomKayahLiCharacter,
} from "./tool.js";

describe("Random Kayah Li Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomKayahLiCharacter(randomKayahLiCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "꤀" } });
    expect(
      runRandomKayahLiCharacter(randomKayahLiCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "꤯" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomKayahLiCharacterValueCount },
        (_, index) =>
          calculateRandomKayahLiCharacter(
            () => (index + 0.5) / randomKayahLiCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomKayahLiCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomKayahLiCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
