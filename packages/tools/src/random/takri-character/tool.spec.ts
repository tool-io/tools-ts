import { describe, expect, it } from "vitest";
import {
  calculateRandomTakriCharacter,
  randomTakriCharacterExample,
  randomTakriCharacterValueCount,
  runRandomTakriCharacter,
} from "./tool.js";

describe("Random Takri Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomTakriCharacter(randomTakriCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "।" } });
    expect(
      runRandomTakriCharacter(randomTakriCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑛉" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomTakriCharacterValueCount },
        (_, index) =>
          calculateRandomTakriCharacter(
            () => (index + 0.5) / randomTakriCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTakriCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomTakriCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
