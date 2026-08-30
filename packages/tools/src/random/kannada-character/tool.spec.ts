import { describe, expect, it } from "vitest";
import {
  calculateRandomKannadaCharacter,
  randomKannadaCharacterExample,
  randomKannadaCharacterValueCount,
  runRandomKannadaCharacter,
} from "./tool.js";

describe("Random Kannada Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomKannadaCharacter(randomKannadaCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "॑" } });
    expect(
      runRandomKannadaCharacter(randomKannadaCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "꠵" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomKannadaCharacterValueCount },
        (_, index) =>
          calculateRandomKannadaCharacter(
            () => (index + 0.5) / randomKannadaCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomKannadaCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomKannadaCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
