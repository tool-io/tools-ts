import { describe, expect, it } from "vitest";
import {
  calculateRandomMorseCodeCharacter,
  randomMorseCodeCharacterExample,
  randomMorseCodeCharacterValueCount,
  runRandomMorseCodeCharacter,
} from "./tool.js";

describe("Random Morse Code Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMorseCodeCharacter(randomMorseCodeCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "A ·−" } });
    expect(
      runRandomMorseCodeCharacter(randomMorseCodeCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "@ ·−−·−·" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMorseCodeCharacterValueCount },
        (_, index) =>
          calculateRandomMorseCodeCharacter(
            () => (index + 0.5) / randomMorseCodeCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMorseCodeCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMorseCodeCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
