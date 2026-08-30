import { describe, expect, it } from "vitest";
import {
  calculateRandomBatakCharacter,
  randomBatakCharacterExample,
  randomBatakCharacterValueCount,
  runRandomBatakCharacter,
} from "./tool.js";

describe("Random Batak Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomBatakCharacter(randomBatakCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ᯀ" } });
    expect(
      runRandomBatakCharacter(randomBatakCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "᯿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomBatakCharacterValueCount },
        (_, index) =>
          calculateRandomBatakCharacter(
            () => (index + 0.5) / randomBatakCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomBatakCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomBatakCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
