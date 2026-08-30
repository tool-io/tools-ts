import { describe, expect, it } from "vitest";
import {
  calculateRandomBugineseCharacter,
  randomBugineseCharacterExample,
  randomBugineseCharacterValueCount,
  runRandomBugineseCharacter,
} from "./tool.js";

describe("Random Buginese Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomBugineseCharacter(randomBugineseCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ᨀ" } });
    expect(
      runRandomBugineseCharacter(randomBugineseCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ꧏ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomBugineseCharacterValueCount },
        (_, index) =>
          calculateRandomBugineseCharacter(
            () => (index + 0.5) / randomBugineseCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomBugineseCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomBugineseCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
