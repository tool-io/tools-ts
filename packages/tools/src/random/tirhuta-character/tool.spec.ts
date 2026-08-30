import { describe, expect, it } from "vitest";
import {
  calculateRandomTirhutaCharacter,
  randomTirhutaCharacterExample,
  randomTirhutaCharacterValueCount,
  runRandomTirhutaCharacter,
} from "./tool.js";

describe("Random Tirhuta Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomTirhutaCharacter(randomTirhutaCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "॑" } });
    expect(
      runRandomTirhutaCharacter(randomTirhutaCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑓙" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomTirhutaCharacterValueCount },
        (_, index) =>
          calculateRandomTirhutaCharacter(
            () => (index + 0.5) / randomTirhutaCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTirhutaCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomTirhutaCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
