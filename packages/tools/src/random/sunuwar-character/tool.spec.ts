import { describe, expect, it } from "vitest";
import {
  calculateRandomSunuwarCharacter,
  randomSunuwarCharacterExample,
  randomSunuwarCharacterValueCount,
  runRandomSunuwarCharacter,
} from "./tool.js";

describe("Random Sunuwar Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomSunuwarCharacter(randomSunuwarCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "̀" } });
    expect(
      runRandomSunuwarCharacter(randomSunuwarCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑯹" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomSunuwarCharacterValueCount },
        (_, index) =>
          calculateRandomSunuwarCharacter(
            () => (index + 0.5) / randomSunuwarCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSunuwarCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomSunuwarCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
