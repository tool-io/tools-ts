import { describe, expect, it } from "vitest";
import {
  calculateRandomOldItalicCharacter,
  randomOldItalicCharacterExample,
  randomOldItalicCharacterValueCount,
  runRandomOldItalicCharacter,
} from "./tool.js";

describe("Random Old Italic Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomOldItalicCharacter(randomOldItalicCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐌀" } });
    expect(
      runRandomOldItalicCharacter(randomOldItalicCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐌯" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomOldItalicCharacterValueCount },
        (_, index) =>
          calculateRandomOldItalicCharacter(
            () => (index + 0.5) / randomOldItalicCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomOldItalicCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomOldItalicCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
