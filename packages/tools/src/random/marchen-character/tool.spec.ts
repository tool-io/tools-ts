import { describe, expect, it } from "vitest";
import {
  calculateRandomMarchenCharacter,
  randomMarchenCharacterExample,
  randomMarchenCharacterValueCount,
  runRandomMarchenCharacter,
} from "./tool.js";

describe("Random Marchen Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMarchenCharacter(randomMarchenCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𑱰" } });
    expect(
      runRandomMarchenCharacter(randomMarchenCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑲶" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMarchenCharacterValueCount },
        (_, index) =>
          calculateRandomMarchenCharacter(
            () => (index + 0.5) / randomMarchenCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMarchenCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMarchenCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
