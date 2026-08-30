import { describe, expect, it } from "vitest";
import {
  calculateRandomAhomCharacter,
  randomAhomCharacterExample,
  randomAhomCharacterValueCount,
  runRandomAhomCharacter,
} from "./tool.js";

describe("Random Ahom Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomAhomCharacter(randomAhomCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𑜀" } });
    expect(
      runRandomAhomCharacter(randomAhomCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑝆" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomAhomCharacterValueCount },
        (_, index) =>
          calculateRandomAhomCharacter(
            () => (index + 0.5) / randomAhomCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomAhomCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomAhomCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
