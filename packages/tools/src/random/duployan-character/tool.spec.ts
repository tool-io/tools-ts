import { describe, expect, it } from "vitest";
import {
  calculateRandomDuployanCharacter,
  randomDuployanCharacterExample,
  randomDuployanCharacterValueCount,
  runRandomDuployanCharacter,
} from "./tool.js";

describe("Random Duployan Shorthand Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomDuployanCharacter(randomDuployanCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "·" } });
    expect(
      runRandomDuployanCharacter(randomDuployanCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𛲟" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomDuployanCharacterValueCount },
        (_, index) =>
          calculateRandomDuployanCharacter(
            () => (index + 0.5) / randomDuployanCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomDuployanCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomDuployanCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
