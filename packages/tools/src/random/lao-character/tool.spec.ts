import { describe, expect, it } from "vitest";
import {
  calculateRandomLaoCharacter,
  randomLaoCharacterExample,
  randomLaoCharacterValueCount,
  runRandomLaoCharacter,
} from "./tool.js";

describe("Random Lao Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomLaoCharacter(randomLaoCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ກ" } });
    expect(
      runRandomLaoCharacter(randomLaoCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ໟ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomLaoCharacterValueCount },
        (_, index) =>
          calculateRandomLaoCharacter(
            () => (index + 0.5) / randomLaoCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomLaoCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomLaoCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
