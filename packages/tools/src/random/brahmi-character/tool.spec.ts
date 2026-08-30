import { describe, expect, it } from "vitest";
import {
  calculateRandomBrahmiCharacter,
  randomBrahmiCharacterExample,
  randomBrahmiCharacterValueCount,
  runRandomBrahmiCharacter,
} from "./tool.js";

describe("Random Brahmi Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomBrahmiCharacter(randomBrahmiCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𑀀" } });
    expect(
      runRandomBrahmiCharacter(randomBrahmiCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑁿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomBrahmiCharacterValueCount },
        (_, index) =>
          calculateRandomBrahmiCharacter(
            () => (index + 0.5) / randomBrahmiCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomBrahmiCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomBrahmiCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
