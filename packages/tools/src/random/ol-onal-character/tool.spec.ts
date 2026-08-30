import { describe, expect, it } from "vitest";
import {
  calculateRandomOlOnalCharacter,
  randomOlOnalCharacterExample,
  randomOlOnalCharacterValueCount,
  runRandomOlOnalCharacter,
} from "./tool.js";

describe("Random Ol Onal Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomOlOnalCharacter(randomOlOnalCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "।" } });
    expect(
      runRandomOlOnalCharacter(randomOlOnalCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𞗿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomOlOnalCharacterValueCount },
        (_, index) =>
          calculateRandomOlOnalCharacter(
            () => (index + 0.5) / randomOlOnalCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomOlOnalCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomOlOnalCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
