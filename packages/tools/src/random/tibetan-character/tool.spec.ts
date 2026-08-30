import { describe, expect, it } from "vitest";
import {
  calculateRandomTibetanCharacter,
  randomTibetanCharacterExample,
  randomTibetanCharacterValueCount,
  runRandomTibetanCharacter,
} from "./tool.js";

describe("Random Tibetan Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomTibetanCharacter(randomTibetanCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ༀ" } });
    expect(
      runRandomTibetanCharacter(randomTibetanCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "》" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomTibetanCharacterValueCount },
        (_, index) =>
          calculateRandomTibetanCharacter(
            () => (index + 0.5) / randomTibetanCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTibetanCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomTibetanCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
