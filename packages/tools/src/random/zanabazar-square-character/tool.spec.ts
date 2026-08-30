import { describe, expect, it } from "vitest";
import {
  calculateRandomZanabazarSquareCharacter,
  randomZanabazarSquareCharacterExample,
  randomZanabazarSquareCharacterValueCount,
  runRandomZanabazarSquareCharacter,
} from "./tool.js";

describe("Random Zanabazar Square Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomZanabazarSquareCharacter(
        randomZanabazarSquareCharacterExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "𑨀" } });
    expect(
      runRandomZanabazarSquareCharacter(
        randomZanabazarSquareCharacterExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "𑩇" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomZanabazarSquareCharacterValueCount },
        (_, index) =>
          calculateRandomZanabazarSquareCharacter(
            () => (index + 0.5) / randomZanabazarSquareCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomZanabazarSquareCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomZanabazarSquareCharacter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
