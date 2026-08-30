import { describe, expect, it } from "vitest";
import {
  calculateRandomSaurashtraCharacter,
  randomSaurashtraCharacterExample,
  randomSaurashtraCharacterValueCount,
  runRandomSaurashtraCharacter,
} from "./tool.js";

describe("Random Saurashtra Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomSaurashtraCharacter(randomSaurashtraCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ꢀ" } });
    expect(
      runRandomSaurashtraCharacter(randomSaurashtraCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "꣙" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomSaurashtraCharacterValueCount },
        (_, index) =>
          calculateRandomSaurashtraCharacter(
            () => (index + 0.5) / randomSaurashtraCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSaurashtraCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomSaurashtraCharacter({}, { random: () => 1 })).toMatchObject(
      { error: { issues: [{ code: "invalid_random_source" }] }, ok: false },
    );
  });
});
