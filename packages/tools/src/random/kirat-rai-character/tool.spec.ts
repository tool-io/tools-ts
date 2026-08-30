import { describe, expect, it } from "vitest";
import {
  calculateRandomKiratRaiCharacter,
  randomKiratRaiCharacterExample,
  randomKiratRaiCharacterValueCount,
  runRandomKiratRaiCharacter,
} from "./tool.js";

describe("Random Kirat Rai Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomKiratRaiCharacter(randomKiratRaiCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𖵀" } });
    expect(
      runRandomKiratRaiCharacter(randomKiratRaiCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𖵹" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomKiratRaiCharacterValueCount },
        (_, index) =>
          calculateRandomKiratRaiCharacter(
            () => (index + 0.5) / randomKiratRaiCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomKiratRaiCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomKiratRaiCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
