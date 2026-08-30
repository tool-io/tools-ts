import { describe, expect, it } from "vitest";
import {
  calculateRandomPsalterPahlaviCharacter,
  randomPsalterPahlaviCharacterExample,
  randomPsalterPahlaviCharacterValueCount,
  runRandomPsalterPahlaviCharacter,
} from "./tool.js";

describe("Random Psalter Pahlavi Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomPsalterPahlaviCharacter(
        randomPsalterPahlaviCharacterExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "ـ" } });
    expect(
      runRandomPsalterPahlaviCharacter(
        randomPsalterPahlaviCharacterExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "𐮯" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomPsalterPahlaviCharacterValueCount },
        (_, index) =>
          calculateRandomPsalterPahlaviCharacter(
            () => (index + 0.5) / randomPsalterPahlaviCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomPsalterPahlaviCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomPsalterPahlaviCharacter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
