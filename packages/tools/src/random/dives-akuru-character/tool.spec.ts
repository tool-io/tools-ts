import { describe, expect, it } from "vitest";
import {
  calculateRandomDivesAkuruCharacter,
  randomDivesAkuruCharacterExample,
  randomDivesAkuruCharacterValueCount,
  runRandomDivesAkuruCharacter,
} from "./tool.js";

describe("Random Dives Akuru Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomDivesAkuruCharacter(randomDivesAkuruCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𑤀" } });
    expect(
      runRandomDivesAkuruCharacter(randomDivesAkuruCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑥙" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomDivesAkuruCharacterValueCount },
        (_, index) =>
          calculateRandomDivesAkuruCharacter(
            () => (index + 0.5) / randomDivesAkuruCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomDivesAkuruCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomDivesAkuruCharacter({}, { random: () => 1 })).toMatchObject(
      { error: { issues: [{ code: "invalid_random_source" }] }, ok: false },
    );
  });
});
