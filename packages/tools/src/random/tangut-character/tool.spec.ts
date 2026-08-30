import { describe, expect, it } from "vitest";
import {
  calculateRandomTangutCharacter,
  randomTangutCharacterExample,
  randomTangutCharacterValueCount,
  runRandomTangutCharacter,
} from "./tool.js";

describe("Random Tangut Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomTangutCharacter(randomTangutCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "⿰" } });
    expect(
      runRandomTangutCharacter(randomTangutCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𘷲" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomTangutCharacterValueCount },
        (_, index) =>
          calculateRandomTangutCharacter(
            () => (index + 0.5) / randomTangutCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTangutCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomTangutCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
