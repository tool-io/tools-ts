import { describe, expect, it } from "vitest";
import {
  calculateRandomInscriptionalPahlaviCharacter,
  randomInscriptionalPahlaviCharacterExample,
  randomInscriptionalPahlaviCharacterValueCount,
  runRandomInscriptionalPahlaviCharacter,
} from "./tool.js";

describe("Random Inscriptional Pahlavi Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomInscriptionalPahlaviCharacter(
        randomInscriptionalPahlaviCharacterExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "𐭠" } });
    expect(
      runRandomInscriptionalPahlaviCharacter(
        randomInscriptionalPahlaviCharacterExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "𐭿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomInscriptionalPahlaviCharacterValueCount },
        (_, index) =>
          calculateRandomInscriptionalPahlaviCharacter(
            () => (index + 0.5) / randomInscriptionalPahlaviCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomInscriptionalPahlaviCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomInscriptionalPahlaviCharacter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
