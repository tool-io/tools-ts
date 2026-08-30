import { describe, expect, it } from "vitest";
import {
  calculateRandomKawiCharacter,
  randomKawiCharacterExample,
  randomKawiCharacterValueCount,
  runRandomKawiCharacter,
} from "./tool.js";

describe("Random Kawi Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomKawiCharacter(randomKawiCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𑼀" } });
    expect(
      runRandomKawiCharacter(randomKawiCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑽚" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomKawiCharacterValueCount },
        (_, index) =>
          calculateRandomKawiCharacter(
            () => (index + 0.5) / randomKawiCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomKawiCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomKawiCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
