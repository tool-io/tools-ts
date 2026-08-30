import { describe, expect, it } from "vitest";
import {
  calculateRandomTotoCharacter,
  randomTotoCharacterExample,
  randomTotoCharacterValueCount,
  runRandomTotoCharacter,
} from "./tool.js";

describe("Random Toto Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomTotoCharacter(randomTotoCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ʼ" } });
    expect(
      runRandomTotoCharacter(randomTotoCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𞊮" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomTotoCharacterValueCount },
        (_, index) =>
          calculateRandomTotoCharacter(
            () => (index + 0.5) / randomTotoCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTotoCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomTotoCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
