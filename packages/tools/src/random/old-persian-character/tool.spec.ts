import { describe, expect, it } from "vitest";
import {
  calculateRandomOldPersianCharacter,
  randomOldPersianCharacterExample,
  randomOldPersianCharacterValueCount,
  runRandomOldPersianCharacter,
} from "./tool.js";

describe("Random Old Persian Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomOldPersianCharacter(randomOldPersianCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐎠" } });
    expect(
      runRandomOldPersianCharacter(randomOldPersianCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐏕" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomOldPersianCharacterValueCount },
        (_, index) =>
          calculateRandomOldPersianCharacter(
            () => (index + 0.5) / randomOldPersianCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomOldPersianCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomOldPersianCharacter({}, { random: () => 1 })).toMatchObject(
      { error: { issues: [{ code: "invalid_random_source" }] }, ok: false },
    );
  });
});
