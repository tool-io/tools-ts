import { describe, expect, it } from "vitest";
import {
  calculateRandomMongolianCharacter,
  randomMongolianCharacterExample,
  randomMongolianCharacterValueCount,
  runRandomMongolianCharacter,
} from "./tool.js";

describe("Random Mongolian Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMongolianCharacter(randomMongolianCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "᠀" } });
    expect(
      runRandomMongolianCharacter(randomMongolianCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑙬" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMongolianCharacterValueCount },
        (_, index) =>
          calculateRandomMongolianCharacter(
            () => (index + 0.5) / randomMongolianCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMongolianCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMongolianCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
