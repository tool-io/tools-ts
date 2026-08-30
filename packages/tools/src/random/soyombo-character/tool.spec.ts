import { describe, expect, it } from "vitest";
import {
  calculateRandomSoyomboCharacter,
  randomSoyomboCharacterExample,
  randomSoyomboCharacterValueCount,
  runRandomSoyomboCharacter,
} from "./tool.js";

describe("Random Soyombo Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomSoyomboCharacter(randomSoyomboCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𑩐" } });
    expect(
      runRandomSoyomboCharacter(randomSoyomboCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑪢" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomSoyomboCharacterValueCount },
        (_, index) =>
          calculateRandomSoyomboCharacter(
            () => (index + 0.5) / randomSoyomboCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSoyomboCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomSoyomboCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
