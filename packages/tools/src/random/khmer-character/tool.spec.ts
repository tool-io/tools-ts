import { describe, expect, it } from "vitest";
import {
  calculateRandomKhmerCharacter,
  randomKhmerCharacterExample,
  randomKhmerCharacterValueCount,
  runRandomKhmerCharacter,
} from "./tool.js";

describe("Random Khmer Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomKhmerCharacter(randomKhmerCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ក" } });
    expect(
      runRandomKhmerCharacter(randomKhmerCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "᧿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomKhmerCharacterValueCount },
        (_, index) =>
          calculateRandomKhmerCharacter(
            () => (index + 0.5) / randomKhmerCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomKhmerCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomKhmerCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
