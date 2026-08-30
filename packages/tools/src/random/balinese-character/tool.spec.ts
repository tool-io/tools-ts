import { describe, expect, it } from "vitest";
import {
  calculateRandomBalineseCharacter,
  randomBalineseCharacterExample,
  randomBalineseCharacterValueCount,
  runRandomBalineseCharacter,
} from "./tool.js";

describe("Random Balinese Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomBalineseCharacter(randomBalineseCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ᬀ" } });
    expect(
      runRandomBalineseCharacter(randomBalineseCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "᭿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomBalineseCharacterValueCount },
        (_, index) =>
          calculateRandomBalineseCharacter(
            () => (index + 0.5) / randomBalineseCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomBalineseCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomBalineseCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
