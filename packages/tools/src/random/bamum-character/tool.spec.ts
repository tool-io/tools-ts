import { describe, expect, it } from "vitest";
import {
  calculateRandomBamumCharacter,
  randomBamumCharacterExample,
  randomBamumCharacterValueCount,
  runRandomBamumCharacter,
} from "./tool.js";

describe("Random Bamum Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomBamumCharacter(randomBamumCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ꚠ" } });
    expect(
      runRandomBamumCharacter(randomBamumCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𖨸" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomBamumCharacterValueCount },
        (_, index) =>
          calculateRandomBamumCharacter(
            () => (index + 0.5) / randomBamumCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomBamumCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomBamumCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
