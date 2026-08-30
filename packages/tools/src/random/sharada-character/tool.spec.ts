import { describe, expect, it } from "vitest";
import {
  calculateRandomSharadaCharacter,
  randomSharadaCharacterExample,
  randomSharadaCharacterValueCount,
  runRandomSharadaCharacter,
} from "./tool.js";

describe("Random Sharada Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomSharadaCharacter(randomSharadaCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "॑" } });
    expect(
      runRandomSharadaCharacter(randomSharadaCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑭧" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomSharadaCharacterValueCount },
        (_, index) =>
          calculateRandomSharadaCharacter(
            () => (index + 0.5) / randomSharadaCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSharadaCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomSharadaCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
