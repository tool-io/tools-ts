import { describe, expect, it } from "vitest";
import {
  calculateRandomTamilCharacter,
  randomTamilCharacterExample,
  randomTamilCharacterValueCount,
  runRandomTamilCharacter,
} from "./tool.js";

describe("Random Tamil Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomTamilCharacter(randomTamilCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "॑" } });
    expect(
      runRandomTamilCharacter(randomTamilCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑿿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomTamilCharacterValueCount },
        (_, index) =>
          calculateRandomTamilCharacter(
            () => (index + 0.5) / randomTamilCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTamilCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomTamilCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
