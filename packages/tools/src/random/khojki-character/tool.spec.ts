import { describe, expect, it } from "vitest";
import {
  calculateRandomKhojkiCharacter,
  randomKhojkiCharacterExample,
  randomKhojkiCharacterValueCount,
  runRandomKhojkiCharacter,
} from "./tool.js";

describe("Random Khojki Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomKhojkiCharacter(randomKhojkiCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "૦" } });
    expect(
      runRandomKhojkiCharacter(randomKhojkiCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑉁" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomKhojkiCharacterValueCount },
        (_, index) =>
          calculateRandomKhojkiCharacter(
            () => (index + 0.5) / randomKhojkiCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomKhojkiCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomKhojkiCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
