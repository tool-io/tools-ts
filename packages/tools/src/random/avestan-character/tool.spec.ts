import { describe, expect, it } from "vitest";
import {
  calculateRandomAvestanCharacter,
  randomAvestanCharacterExample,
  randomAvestanCharacterValueCount,
  runRandomAvestanCharacter,
} from "./tool.js";

describe("Random Avestan Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomAvestanCharacter(randomAvestanCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "·" } });
    expect(
      runRandomAvestanCharacter(randomAvestanCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐬿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomAvestanCharacterValueCount },
        (_, index) =>
          calculateRandomAvestanCharacter(
            () => (index + 0.5) / randomAvestanCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomAvestanCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomAvestanCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
