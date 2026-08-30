import { describe, expect, it } from "vitest";
import {
  calculateRandomDograCharacter,
  randomDograCharacterExample,
  randomDograCharacterValueCount,
  runRandomDograCharacter,
} from "./tool.js";

describe("Random Dogra Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomDograCharacter(randomDograCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "।" } });
    expect(
      runRandomDograCharacter(randomDograCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑠻" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomDograCharacterValueCount },
        (_, index) =>
          calculateRandomDograCharacter(
            () => (index + 0.5) / randomDograCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomDograCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomDograCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
