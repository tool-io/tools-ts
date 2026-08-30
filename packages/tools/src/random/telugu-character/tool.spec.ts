import { describe, expect, it } from "vitest";
import {
  calculateRandomTeluguCharacter,
  randomTeluguCharacterExample,
  randomTeluguCharacterValueCount,
  runRandomTeluguCharacter,
} from "./tool.js";

describe("Random Telugu Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomTeluguCharacter(randomTeluguCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "॑" } });
    expect(
      runRandomTeluguCharacter(randomTeluguCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ᳲ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomTeluguCharacterValueCount },
        (_, index) =>
          calculateRandomTeluguCharacter(
            () => (index + 0.5) / randomTeluguCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTeluguCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomTeluguCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
