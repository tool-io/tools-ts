import { describe, expect, it } from "vitest";
import {
  calculateRandomInscriptionalParthianCharacter,
  randomInscriptionalParthianCharacterExample,
  randomInscriptionalParthianCharacterValueCount,
  runRandomInscriptionalParthianCharacter,
} from "./tool.js";

describe("Random Inscriptional Parthian Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomInscriptionalParthianCharacter(
        randomInscriptionalParthianCharacterExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "𐭀" } });
    expect(
      runRandomInscriptionalParthianCharacter(
        randomInscriptionalParthianCharacterExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "𐭟" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomInscriptionalParthianCharacterValueCount },
        (_, index) =>
          calculateRandomInscriptionalParthianCharacter(
            () =>
              (index + 0.5) / randomInscriptionalParthianCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomInscriptionalParthianCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomInscriptionalParthianCharacter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
