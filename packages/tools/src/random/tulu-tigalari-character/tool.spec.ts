import { describe, expect, it } from "vitest";
import {
  calculateRandomTuluTigalariCharacter,
  randomTuluTigalariCharacterExample,
  randomTuluTigalariCharacterValueCount,
  runRandomTuluTigalariCharacter,
} from "./tool.js";

describe("Random Tulu-Tigalari Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomTuluTigalariCharacter(randomTuluTigalariCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "೦" } });
    expect(
      runRandomTuluTigalariCharacter(randomTuluTigalariCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑏢" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomTuluTigalariCharacterValueCount },
        (_, index) =>
          calculateRandomTuluTigalariCharacter(
            () => (index + 0.5) / randomTuluTigalariCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTuluTigalariCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomTuluTigalariCharacter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
