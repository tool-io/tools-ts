import { describe, expect, it } from "vitest";
import {
  calculateRandomOsmanyaCharacter,
  randomOsmanyaCharacterExample,
  randomOsmanyaCharacterValueCount,
  runRandomOsmanyaCharacter,
} from "./tool.js";

describe("Random Osmanya Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomOsmanyaCharacter(randomOsmanyaCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐒀" } });
    expect(
      runRandomOsmanyaCharacter(randomOsmanyaCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐒩" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomOsmanyaCharacterValueCount },
        (_, index) =>
          calculateRandomOsmanyaCharacter(
            () => (index + 0.5) / randomOsmanyaCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomOsmanyaCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomOsmanyaCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
