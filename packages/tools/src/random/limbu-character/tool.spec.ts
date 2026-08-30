import { describe, expect, it } from "vitest";
import {
  calculateRandomLimbuCharacter,
  randomLimbuCharacterExample,
  randomLimbuCharacterValueCount,
  runRandomLimbuCharacter,
} from "./tool.js";

describe("Random Limbu Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomLimbuCharacter(randomLimbuCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "॥" } });
    expect(
      runRandomLimbuCharacter(randomLimbuCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "᥏" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomLimbuCharacterValueCount },
        (_, index) =>
          calculateRandomLimbuCharacter(
            () => (index + 0.5) / randomLimbuCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomLimbuCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomLimbuCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
