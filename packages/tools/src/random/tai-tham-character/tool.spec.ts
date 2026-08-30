import { describe, expect, it } from "vitest";
import {
  calculateRandomTaiThamCharacter,
  randomTaiThamCharacterExample,
  randomTaiThamCharacterValueCount,
  runRandomTaiThamCharacter,
} from "./tool.js";

describe("Random Tai Tham Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomTaiThamCharacter(randomTaiThamCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ᨠ" } });
    expect(
      runRandomTaiThamCharacter(randomTaiThamCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "᪭" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomTaiThamCharacterValueCount },
        (_, index) =>
          calculateRandomTaiThamCharacter(
            () => (index + 0.5) / randomTaiThamCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTaiThamCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomTaiThamCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
