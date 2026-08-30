import { describe, expect, it } from "vitest";
import {
  calculateRandomCherokeeCharacter,
  randomCherokeeCharacterExample,
  randomCherokeeCharacterValueCount,
  runRandomCherokeeCharacter,
} from "./tool.js";

describe("Random Cherokee Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomCherokeeCharacter(randomCherokeeCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "̀" } });
    expect(
      runRandomCherokeeCharacter(randomCherokeeCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ꮿ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomCherokeeCharacterValueCount },
        (_, index) =>
          calculateRandomCherokeeCharacter(
            () => (index + 0.5) / randomCherokeeCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomCherokeeCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomCherokeeCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
