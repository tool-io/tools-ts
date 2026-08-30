import { describe, expect, it } from "vitest";
import {
  calculateRandomChakmaCharacter,
  randomChakmaCharacterExample,
  randomChakmaCharacterValueCount,
  runRandomChakmaCharacter,
} from "./tool.js";

describe("Random Chakma Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomChakmaCharacter(randomChakmaCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "০" } });
    expect(
      runRandomChakmaCharacter(randomChakmaCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑅇" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomChakmaCharacterValueCount },
        (_, index) =>
          calculateRandomChakmaCharacter(
            () => (index + 0.5) / randomChakmaCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomChakmaCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomChakmaCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
