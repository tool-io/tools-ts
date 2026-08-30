import { describe, expect, it } from "vitest";
import {
  calculateRandomRejangCharacter,
  randomRejangCharacterExample,
  randomRejangCharacterValueCount,
  runRandomRejangCharacter,
} from "./tool.js";

describe("Random Rejang Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomRejangCharacter(randomRejangCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ꤰ" } });
    expect(
      runRandomRejangCharacter(randomRejangCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "꥟" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomRejangCharacterValueCount },
        (_, index) =>
          calculateRandomRejangCharacter(
            () => (index + 0.5) / randomRejangCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomRejangCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomRejangCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
