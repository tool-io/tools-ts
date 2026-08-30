import { describe, expect, it } from "vitest";
import {
  calculateRandomBaybayinCharacter,
  randomBaybayinCharacterExample,
  randomBaybayinCharacterValueCount,
  runRandomBaybayinCharacter,
} from "./tool.js";

describe("Random Baybayin Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomBaybayinCharacter(randomBaybayinCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ᜀ" } });
    expect(
      runRandomBaybayinCharacter(randomBaybayinCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "᜶" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomBaybayinCharacterValueCount },
        (_, index) =>
          calculateRandomBaybayinCharacter(
            () => (index + 0.5) / randomBaybayinCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomBaybayinCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomBaybayinCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
