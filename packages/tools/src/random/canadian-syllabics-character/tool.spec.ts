import { describe, expect, it } from "vitest";
import {
  calculateRandomCanadianSyllabicsCharacter,
  randomCanadianSyllabicsCharacterExample,
  randomCanadianSyllabicsCharacterValueCount,
  runRandomCanadianSyllabicsCharacter,
} from "./tool.js";

describe("Random Canadian Syllabics Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomCanadianSyllabicsCharacter(
        randomCanadianSyllabicsCharacterExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "᐀" } });
    expect(
      runRandomCanadianSyllabicsCharacter(
        randomCanadianSyllabicsCharacterExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "𑪿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomCanadianSyllabicsCharacterValueCount },
        (_, index) =>
          calculateRandomCanadianSyllabicsCharacter(
            () => (index + 0.5) / randomCanadianSyllabicsCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomCanadianSyllabicsCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomCanadianSyllabicsCharacter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
