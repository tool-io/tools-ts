import { describe, expect, it } from "vitest";
import {
  calculateRandomNushuCharacter,
  randomNushuCharacterExample,
  randomNushuCharacterValueCount,
  runRandomNushuCharacter,
} from "./tool.js";

describe("Random Nushu Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomNushuCharacter(randomNushuCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𖿡" } });
    expect(
      runRandomNushuCharacter(randomNushuCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𛋻" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomNushuCharacterValueCount },
        (_, index) =>
          calculateRandomNushuCharacter(
            () => (index + 0.5) / randomNushuCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomNushuCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomNushuCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
