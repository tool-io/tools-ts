import { describe, expect, it } from "vitest";
import {
  calculateRandomOlChikiCharacter,
  randomOlChikiCharacterExample,
  randomOlChikiCharacterValueCount,
  runRandomOlChikiCharacter,
} from "./tool.js";

describe("Random Ol Chiki Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomOlChikiCharacter(randomOlChikiCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "᱐" } });
    expect(
      runRandomOlChikiCharacter(randomOlChikiCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "᱿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomOlChikiCharacterValueCount },
        (_, index) =>
          calculateRandomOlChikiCharacter(
            () => (index + 0.5) / randomOlChikiCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomOlChikiCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomOlChikiCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
